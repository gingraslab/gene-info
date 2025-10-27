const createFolder = require('../helpers/create-folder');
const downloadFtp = require('../helpers/download-ftp');
const minHuman = require('./min-human');

const fsConfig = {
  folder: './files/gene-names',
  files: [
    {
      file: './files/gene-names/hgnc.json',
      host: 'ftp.ebi.ac.uk',
      hostFile: '/pub/databases/genenames/out_of_date_hgnc/json/locus_groups/protein-coding_gene.json',
    },
  ],
};

/* Download and unzip expression database from HPA */
const geneName = options => (
  new Promise((resolve, reject) => {
    createFolder(fsConfig.folder)
      .then(() => Promise.all([
        downloadFtp(
          fsConfig.files[0].host,
          fsConfig.files[0].hostFile,
          fsConfig.files[0].file,
          options.skipDownload,
        ),
      ]))
      .then(() => Promise.all([
        minHuman(fsConfig.files[0].file, fsConfig.folder, options.skipMin),
      ]))
      .then(() => { resolve(); })
      .catch((err) => {
        reject(err);
      });
  })
);

module.exports = geneName;
