const { promises } = require('fs');

const config = require('./config');
const domainParse = require('./domains/domain-parse');
const expressionParse = require('./rna-expression/expression-parse');
const intParse = require('./interactions/iterate-tab');
const mergeDB = require('./merge-db');
const uniParse = require('./uniprot/iterate-xml');

const speciesDB = specie => (
  new Promise((resolve, reject) => {
    let rnaTissues;
    Promise.all([
      uniParse(`./files/uniprot/${specie}.xml`),
      expressionParse(
        `./files/rna-expression/cells/${specie}.tsv`,
        `./files/rna-expression/tissues/${specie}.tsv`,
      ),
      domainParse(`./files/domains/${specie}.tsv`, './files/domains/domain-names.tsv'),
      intParse(`./files/interactions/${specie}.tab`),
    ])
      .then((values) => {
        [, { rnaTissues }] = values;
        const merged = mergeDB(values);
        return promises.writeFile(`./files/databases/${specie}.json`, JSON.stringify(merged, null, 2));
      })
      .then(() => {
        resolve(rnaTissues);
      })
      .catch((err) => {
        reject(err);
      });
  })
);

const generateDB = () => (
  new Promise((resolve) => {
    const rnaTissues = {};
    const iterator = async (species) => {
      await Promise.all(species.map(async (specie) => {
        rnaTissues[specie] = await speciesDB(specie);
      }));
      resolve(rnaTissues);
    };

    iterator(config.species);
  })
);

module.exports = generateDB;
