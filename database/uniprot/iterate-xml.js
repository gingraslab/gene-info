const fs = require('fs');
const readline = require('readline');

const convertXml = require('../helpers/convert-xml');
const parseEntry = require('./parse-entry');

/* Iterate over an Uniprot XML file line by line and concatenate each entry to
** a string. The entry is then converted to a JS object and parsed for desired fields. */
const iterateXml = file => (
  new Promise((resolve, reject) => {
    const entries = [];
    let entry = '';

    if (fs.existsSync(file)) {
      const lineReader = readline.createInterface({
        input: fs.createReadStream(file),
      });
      lineReader.on('line', async (line) => {
        if (line.startsWith('<entry')) {
          entry = line;
        } else if (line.startsWith('</entry>')) {
          entry += `${line}\n`;
          const js = await convertXml(entry);
          const parsed = parseEntry(js.entry);
          if (parsed) {
            entries.push(parsed);
          }
        } else {
          entry += `${line}\n`;
        }
      });
      lineReader.on('close', () => {
        resolve(entries);
      });
      lineReader.on('error', (err) => {
        reject(err);
      });
    } else {
      resolve(entries);
    }
  })
);

module.exports = iterateXml;