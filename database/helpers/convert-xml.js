const { Parser } = require('xml2js');

const parser = new Parser({
  explicitArray: true,
  mergeAttrs: false,
  attrkey: '$',
  charkey: '_',
  trim: false,
  normalizeTags: false,
  normalize: false,
  explicitRoot: true,
  strict: true,
});

function convertXml(xml) {
  return new Promise((resolve, reject) => {
    parser.parseString(xml, (err, js) => {
      if (err) return reject(err);
      resolve(js);
    });
  });
}

module.exports = convertXml;
