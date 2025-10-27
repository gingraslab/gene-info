// helpers/read-json.js
const fs = require('fs');

const DEFAULT_STREAM_THRESHOLD = 200 * 1024 * 1024; // 200 MB

let parser, Assembler;
function ensureStreamJson() {
  if (!parser || !Assembler) {
    ({ parser } = require('stream-json'));
    Assembler = require('stream-json/Assembler');
  }
}

function readJson(file, { streamThreshold = DEFAULT_STREAM_THRESHOLD } = {}) {
  return new Promise((resolve, reject) => {
    fs.stat(file, (stErr, stats) => {
      if (stErr) return reject(stErr);

      // Small/medium files: keep old fast path
      if (stats.size <= streamThreshold) {
        return fs.readFile(file, 'utf8', (err, data) => {
          if (err) return reject(err);
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`read-json: invalid JSON in ${file}: ${e.message}`));
          }
        });
      }

      // Large files: stream-parse
      ensureStreamJson();
      const rs = fs.createReadStream(file);
      const p = parser();
      const asm = Assembler.connectTo(p);

      const bail = (e) => { rs.destroy(); reject(e); };
      rs.on('error', bail);
      p.on('error', bail);

      asm.on('done', () => resolve(asm.current));
      rs.pipe(p);
    });
  });
}

module.exports = readJson;
