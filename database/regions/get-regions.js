/* eslint no-console: 0 */
/* eslint no-param-reassign: 0 */

const fs = require('fs');

const arrayUnique = require('../helpers/array-unique');
const fetchJson = require('../helpers/fetch');

const parseRegions = json => (
  json.motifs.map(region => ({
    end: region.end,
    name: region.type,
    start: region.start,
  }))
);

const fetchGraphic = async (uniprotId) => {
  try {
    // 1) UniProt features
    const u = await fetchJson(`https://rest.uniprot.org/uniprotkb/${uniprotId}.json`);
    const feat = Array.isArray(u?.features) ? u.features : [];
    const regions = [];

    for (const f of feat) {
      const start = f?.location?.start?.value;
      const end   = f?.location?.end?.value;
      if (!Number.isInteger(start) || !Number.isInteger(end)) continue;

      const type = String(f.type || '').toLowerCase();
      const note = String(f.description || f.note || '').toLowerCase();

      if (type === 'signal peptide' || type.includes('signal')) {
        regions.push({ name: 'sig_p', start, end });
      } else if (type === 'transmembrane region' || type.startsWith('transmembrane')) {
        regions.push({ name: 'transmembrane', start, end });
      } else if (type === 'compositional bias' && /low.?complex/.test(note)) {
        regions.push({ name: 'low_complexity', start, end });
      } else if (type === 'disordered region' || type.includes('disorder')) {
        regions.push({ name: 'disorder', start, end });
      }
    }

    // 2) If no disorder came from UniProt, fill from MobiDB
    if (!regions.some(r => r.name === 'disorder')) {
      const m = await fetchJson(`https://mobidb.org/api/download?acc=${uniprotId}&format=json`);
      const dis =
        m?.['disorder-disHL']?.regions ||
        m?.['disorder-consensus']?.regions ||
        [];
      if (Array.isArray(dis)) {
        for (const [s, e] of dis) regions.push({ name: 'disorder', start: s, end: e });
      }
    }
    console.error('[fetchGraphic]', uniprotId, 'features:', feat.length, 'parsed:', regions.length);
    return regions;
  } catch {
    return [];
  }
};

const writeRegions = (id, regions, stream) => {
  regions.forEach((region) => {
    stream.write(`${id}\t${region.name}\t${region.start}\t${region.end}\n`);
  });
};

const iterateIDs = async (ids, streams) => {
  await Object.entries(ids).reduce(async (promise, [id, specie]) => {
    await promise;
    const regions = await fetchGraphic(id);
    writeRegions(id, regions, streams[specie]);
  }, Promise.resolve());
};

const getRegions = (path, ids) => (
  new Promise((resolve, reject) => {
    const species = arrayUnique(Object.values(ids));
    const streams = Object.values(species).reduce((accum, specie) => {
      const writeStream = fs.createWriteStream(`${path}/${specie}.tsv`, { flags: 'w' });
      accum[specie] = writeStream;
      return accum;
    }, {});

    iterateIDs(ids, streams)
      .then(() => {
        Object.values(streams).forEach((stream) => {
          stream.end();
        });
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  })
);

module.exports = {
  fetchGraphic,
  parseRegions,
  getRegions,
  writeRegions,
};
