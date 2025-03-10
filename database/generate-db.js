const config = require('./config');
const createFolder = require('./helpers/create-folder');
const domainParse = require('./domains/domain-parse');
const intParse = require('./interactions/iterate-tab');
const jsonStringify = require('./helpers/json-stringify');
const mergeDB = require('./merge-db');
const parseProteinExpression = require('./expression/protein/parse-data').parseData;
const parseRNAExpression = require('./expression/rna/parse-data').parseData;
const regionParse = require('./regions/region-parse');
const uniParse = require('./uniprot/iterate-xml');
const { geneNameParse } = require('./gene-names/gene-name-parse');
const { localizationParse } = require('./localization/localization-parse');
const { parseData: essentialityParse } = require('./essentiality/parse-data');
const { readObo } = require('./go/read-obo');

const speciesDB = async (specie, obo) => {
  const parsedData = await Promise.all([
    parseProteinExpression(
      `./files/protein-expression/cells/${specie}.json`,
      `./files/protein-expression/tissues/${specie}.json`,
    ),
    parseRNAExpression(
      `./files/rna-expression/cells/${specie}.tsv`,
      `./files/rna-expression/tissues/${specie}.tsv`,
    ),
    essentialityParse(
      `./files/essentiality/${specie}.csv`,
      `./files/essentiality/${specie}-cell-info.csv`,
      `./files/essentiality/${specie}-co-dependency.csv`,
    ),
    uniParse(`./files/uniprot/${specie}.xml`),
    domainParse(`./files/domains/${specie}.tsv`, './files/domains/domain-names.tsv'),
    geneNameParse(`./files/gene-names/${specie}.json`, specie),
    intParse(`./files/interactions/${specie}.tab`),
    localizationParse(
      `./files/localization/hpa/${specie}.tsv`,
      `./files/localization/compartments/${specie}.tsv`,
      `./files/go/${specie}.tsv`,
      obo,
    ),
    regionParse(`./files/regions/${specie}.tsv`),
  ]);

  const merged = mergeDB(parsedData);
  await jsonStringify(`./files/databases/${specie}.json`, merged);

  const [{ proteinTissues }, { rnaTissues }, { essentialityTissues }] = parsedData;
  return {
    essentiality: essentialityTissues,
    protein: proteinTissues,
    rna: rnaTissues,
  };
};

const generateDB = async () => {
  await createFolder('./files/databases');
  const obo = await readObo('./files/go/go-basic.obo');
  const { speciesID } = config;
  const species = Object.values(speciesID);

  const tissues = {
    essentiality: {},
    protein: {},
    rna: {},
  };

  const iterator = async () => {
    await Promise.all(species.map(async (specie) => {
      const { essentiality, protein, rna } = await speciesDB(specie, obo);
      tissues.essentiality[specie] = essentiality;
      tissues.protein[specie] = protein;
      tissues.rna[specie] = rna;
    }));
  };

  await iterator();

  return {
    essentiality: tissues.essentiality,
    protein: tissues.protein,
    rna: tissues.rna,
  };
};

module.exports = generateDB;
