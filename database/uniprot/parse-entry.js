const arrSort = require('../helpers/arr-sort');
const arrSortByKey = require('../helpers/arr-sort-by-key');
const arrayUnique = require('../helpers/array-unique');
const findGene = require('./find-gene');
const getComments = require('./get-comments');
const getDBRefs = require('./get-dbrefs');
const getSequence = require('./get-sequence');
const { getNames } = require('./get-names');

// Parses a Uniprot XML entry after conversion with xml2js.
const parseEntry = (entry) => {
  const genes = findGene(entry.gene);
  if (genes.primary) {
    const comments = getComments(entry.comment);
    const names = getNames(entry.protein[0]);
    const refs = getDBRefs(entry.dbReference);
    const sequence = getSequence(entry.sequence[0]);
    const parsed = {
      alternativeNames: names.alternative,
      biogrid: refs.biogrid,
      description: comments.description,
      'ensembl-gene': refs['ensembl-gene'],
      'ensembl-protein': refs['ensembl-protein'],
      fullname: names.full,
      gene: genes.primary,
      geneid: refs.geneid,
      go: {
        c: arrSortByKey(refs.go.c, 'term'),
        f: arrSortByKey(refs.go.f, 'term'),
        p: arrSortByKey(refs.go.p, 'term'),
      },
      hgnc: refs.hgnc,
      length: sequence.length,
      localization: {
        uniprot: arrSort.alphabetical(arrayUnique(comments.localization)),
      },
      locus: genes.locus,
      mw: sequence.mw,
      orf: genes.orf,
      pathology: arrSortByKey(comments.pathology, 'name'),
      pathway: arrSortByKey(refs.pathway, 'term'),
      proteomicsdb: refs.proteomicsdb,
      refseq: refs.refseq,
      synonyms: arrSort.alphabetical(genes.synonyms),
      uniprot: entry.accession,
    };

    // Add species specific fields to end of entry
    if (refs.biocyc) {
      parsed.biocyc = refs.biocyc;
    } if (refs.dictybase) {
      parsed.dictybase = refs.dictybase;
    } if (refs.flybase) {
      parsed.flybase = refs.flybase;
    } if (refs.mgi) {
      parsed.mgi = refs.mgi;
    } if (refs.mim) {
      parsed.mim = refs.mim;
    } if (refs.pombase) {
      parsed.pombase = refs.pombase;
    } if (refs.sgd) {
      parsed.sgd = refs.sgd;
    } if (refs.tair) {
      parsed.tair = refs.tair;
    } if (refs.wormbase) {
      parsed.wormbase = refs.wormbase;
      parsed.orf = arrSort.alphabetical(arrayUnique([...parsed.orf, ...refs.wormIsoforms]));
    } if (refs.xenbase) {
      parsed.xenbase = refs.xenbase;
    } if (refs.zfin) {
      parsed.zfin = refs.zfin;
    }
    return parsed;
  }
  return null;
};

module.exports = parseEntry;