const createFolder = require('../../helpers/create-folder');
const downloadHttps = require('../../helpers/download-https');
const unzipFile = require('../../helpers/unzip-file');

const fsConfig = {
  cell: {
    file: './files/rna-expression/cells/Homo sapiens.tsv',
    url: 'https://www.proteinatlas.org/download/tsv/rna_celline.tsv.zip',
    zipFile: './files/rna-expression/cells/Homo sapiens.zip',
  },
  tissue: {
    file: './files/rna-expression/tissues/Homo sapiens.tsv',
    url: 'https://www.proteinatlas.org/download/tsv/rna_tissue_hpa.tsv.zip',
    zipFile: './files/rna-expression/tissues/Homo sapiens.zip',
  },
};

const createFolders = async () => {
  await Promise.all([
    createFolder('./files/rna-expression/cells'),
    createFolder('./files/rna-expression/tissues'),
  ]);
};

const setupDownloads = async () => {
  await Promise.all([
    downloadHttps(fsConfig.cell.url, fsConfig.cell.zipFile),
    downloadHttps(fsConfig.tissue.url, fsConfig.tissue.zipFile),
  ]);
};

const unzipFiles = async () => {
  await Promise.all([
    unzipFile('unzip', fsConfig.cell.zipFile, fsConfig.cell.file),
    unzipFile('unzip', fsConfig.tissue.zipFile, fsConfig.tissue.file),
  ]);
};

const getData = async (options) => {
  if (!options.skipDownload) {
    await createFolders();
    await setupDownloads();
  }

  if (!options.skipUnzip) {
    await unzipFiles();
  }
};

module.exports = getData;
