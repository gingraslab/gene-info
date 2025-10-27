const createFolder = require('../helpers/create-folder');
const config = require('../config');
const downloadFtp = require('../helpers/download-ftp');
const minPfam = require('./min-pfam');
const unzipFile = require('../helpers/unzip-file');

const fsConfig = {
  domains: {
    file: './files/domains/domains-uniprot.tsv',
    host: 'ftp.ebi.ac.uk',
    hostFile: 'pub/databases/Pfam/current_release/Pfam-A.regions.tsv.gz',
    zipFile: './files/domains/domains-uniprot.gz',
  },
  folder: 'files/domains',
  names: {
    file: './files/domains/domain-names.tsv',
    host: 'ftp.ebi.ac.uk',
    hostFile: 'pub/databases/Pfam/current_release/Pfam-A.clans.tsv.gz',
    zipFile: './files/domains/domain-names.gz',
  },
};

/* Download and unzip domain database from Pfam. */
const domains = options => (
  new Promise((resolve, reject) => {
    createFolder(fsConfig.folder)
      .then(() => Promise.all([
        downloadFtp(
          fsConfig.domains.host,
          fsConfig.domains.hostFile,
          fsConfig.domains.zipFile,
          options.skipDownload,
        ),
        downloadFtp(
          fsConfig.names.host,
          fsConfig.names.hostFile,
          fsConfig.names.zipFile,
          options.skipDownload,
        ),
      ]))
      .then(() => Promise.all([
        unzipFile('gunzip', fsConfig.domains.zipFile, fsConfig.domains.file, options.skipUnzip),
        unzipFile('gunzip', fsConfig.names.zipFile, fsConfig.names.file, options.skipUnzip),
      ]))
      .then(() => minPfam(
        fsConfig.domains.file,
        './files/domains',
        config.speciesID,
        './files/uniprot/uniprot-ids.json',
        options.skipMin,
      ))
      .then(() => { resolve(); })
      .catch((err) => {
        reject(err);
      });
  })
);

module.exports = domains;
