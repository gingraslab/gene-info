/* eslint no-param-reassign: 0 */

const fs = require("fs");
const readline = require("readline");

const writeIDs = (ids, path, resolve, reject) => {
  fs.promises
    .writeFile(`${path}/uniprot-ids.json`, JSON.stringify(ids, null, 2), "UTF8")
    .then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
};

/* Reads a Uniprot XML file and removes any fields and species not
 ** explicitely listed in arguments. Entries will get written to file
 ** based on species type. An ID file will also be written with all
 ** primary accessions and their species for species that are requested. */
const minXml = (file, path, speciesID, fields, skip) =>
  new Promise((resolve, reject) => {
    if (skip) {
      resolve();
    } else {
      let accession = "";
      let entry = "";
      const ids = {};
      let keepEntry = false;
      let keepField = false;
      let organism = "";

      const accessionRegex = /^\s*<accession>([^<]+)<\/accession>/;
      const fieldLineRegex = /^\s*<(?!dbReference\b|\/|\?|\!)[A-Za-z_]/;
      const fieldRegex = /^\s*<([A-Za-z_][\w:.-]*)\b/;
      const speciesRegex = /^\s*<dbReference\s+type="NCBI Taxonomy"\s+id="(\d+)"\/>/;

      // Create stream for writing XML data.
      const streams = Object.values(speciesID).reduce((accum, specie) => {
        const writeStream = fs.createWriteStream(`${path}/${specie}.xml`, {
          flags: "w",
        });
        writeStream.write("<uniprot>\n");
        accum[specie] = writeStream;
        return accum;
      }, {});

      const lineReader = readline.createInterface({
        input: fs.createReadStream(file),
        crlfDelay: Infinity,
      });

      const reEntryOpen = /^\s*<entry\b/;
      const reEntryClose = /^\s*<\/entry>/;
      const reStartTag = /^\s*<([A-Za-z_][\w:.-]*)\b/;
      const reEndTag = /^\s*<\/([A-Za-z_][\w:.-]*)>/;
      const reSelfClose = /\/>\s*$/;

      let includeRoot = null;

      lineReader.on("line", (line) => {
        // start of <entry>
        if (reEntryOpen.test(line)) {
          accession = "";
          entry = "";
          keepEntry = false;
          keepField = false;
          includeRoot = null;
          organism = "";

          // ALWAYS preserve the <entry ...> opening tag in the buffer
          entry += `${line}\n`;
          return;
        }

        // end of </entry>
        if (reEntryClose.test(line)) {
          // ALWAYS preserve the </entry> in the buffer (so the block is well-formed)
          entry += `${line}\n`;

          if (keepEntry) {
            // Only write out if this entry belongs to a target species
            streams[organism].write(entry);
            ids[accession] = organism;
          }
          return;
        }

        // species detection (so we know whether to write this entry at the end)
        if (speciesRegex.test(line)) {
          const [, taxonID] = line.match(speciesRegex);
          keepEntry = Boolean(speciesID[taxonID]);
          organism = speciesID[taxonID];
          // fall through; nothing to append here (unless it’s also an allowed field)
        }

        // If we're already inside an allowed top-level field, keep everything until its closing tag
        if (includeRoot) {
          entry += `${line}\n`;
          const mEnd = line.match(reEndTag);
          if (mEnd && mEnd[1] === includeRoot) {
            includeRoot = null;
            keepField = false;
          }
          return;
        }

        // Not inside an included field: only react to a new start tag
        const mStart = line.match(reStartTag);
        if (!mStart) {
          // Non-tag or text node outside included root — skip
          return;
        }

        const tag = mStart[1];

        // Handle <accession> specially: keep line if allowed; also capture its value once
        if (tag === "accession") {
          if (fields.includes("accession")) {
            entry += `${line}\n`;
          }
          if (!accession) {
            const mAcc = line.match(accessionRegex);
            if (mAcc) accession = mAcc[1];
          }
          return;
        }

        // If this top-level tag is in the allow-list, include the whole element (until </tag>)
        if (fields.includes(tag)) {
          includeRoot = tag;
          keepField = true;
          entry += `${line}\n`;
          // If it self-closes (e.g., <dbReference .../>), immediately stop including
          if (reSelfClose.test(line)) {
            includeRoot = null;
            keepField = false;
          }
          return;
        }

        // Otherwise: a top-level tag we don't keep -> skip
      });

      lineReader.on("close", () => {
        Object.values(streams).forEach((stream) => {
          stream.write("</uniprot>\n");
          stream.end();
        });
        writeIDs(ids, path, resolve, reject);
      });
      lineReader.on("error", (err) => {
        reject(err);
      });
    }
  });

module.exports = minXml;