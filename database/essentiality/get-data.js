/* eslint-disable max-len */
const { cwd } = require('process');
const { exec } = require('child_process');

const createFolder = require('../helpers/create-folder');
const downloadHttps = require('../helpers/download-https');

const OUT_FOLDER = './files/essentiality';

const fsConfig = {
  celldata: {
    file: `${OUT_FOLDER}/Homo sapiens-cell-info.csv`,
    url: 'https://ndownloader.figshare.com/files/34008503',
  },
  coDependency: {
    file: `${OUT_FOLDER}/Homo sapiens-co-dependency.csv`,
  },
  effectsData: {
    file: `${OUT_FOLDER}/Homo sapiens.csv`,
    url: 'https://ndownloader.figshare.com/files/34008491',
  },
};

const generateCoDependencies = () => (
  new Promise((resolve) => {
    const currDir = cwd();
    const command = `py ${__dirname}/correlation_from_csv.py "${currDir}/${fsConfig.effectsData.file}" "${currDir}/${fsConfig.effectsData.file}" "${currDir}/${fsConfig.coDependency.file}"`;
    const process = exec(
      command,
      { cwd: OUT_FOLDER },
    );
    process.on('error', () => {
      resolve();
    });
    process.on('exit', () => {
      resolve();
    });
  })
);

const setupDownloads = async () => {
  await Promise.all([
    downloadHttps(fsConfig.celldata.url, fsConfig.celldata.file),
    downloadHttps(fsConfig.effectsData.url, fsConfig.effectsData.file),
  ]);
};

const essentiality = async (options) => {
  if (!options.skipDownload) {
    await createFolder(OUT_FOLDER);
    await setupDownloads();
    await generateCoDependencies();
  }
};

module.exports = essentiality;
