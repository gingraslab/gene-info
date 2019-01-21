const arrayUnique = require('../helpers/array-unique');

const getDBRefs = dbRefs => (
  dbRefs.reduce((accum, ref) => {
    if (ref.$.type === 'BioGrid') {
      return {
        ...accum,
        biogrid: Number(ref.$.id),
      };
    } if (ref.$.type === 'FlyBase') {
      return {
        ...accum,
        flybase: ref.$.id,
      };
    } if (ref.$.type === 'GeneID') {
      return {
        ...accum,
        geneid: Number(ref.$.id),
      };
    } if (ref.$.type === 'GO') {
      const go = ref.property.reduce((accumRef, prop) => {
        if (prop.$.type === 'term') {
          const term = prop.$.value.split(':');
          return {
            ...accumRef,
            compartment: term[0].toLowerCase(),
            term: term[1],
          };
        }
        return accumRef;
      }, { id: ref.$.id.split(':')[1] });
      return {
        ...accum,
        go: {
          ...accum.go,
          [go.compartment]: [
            ...accum.go[go.compartment],
            {
              id: go.id,
              term: go.term,
            },
          ],
        },
      };
    } if (ref.$.type === 'Ensembl') {
      const ensembl = ref.property.reduce((accumRef, prop) => {
        if (prop.$.type === 'gene ID') {
          return {
            ...accumRef,
            gene: prop.$.value,
          };
        } if (prop.$.type === 'protein sequence ID') {
          return {
            ...accumRef,
            protein: prop.$.value,
          };
        }
        return accumRef;
      }, {});
      return {
        ...accum,
        'ensembl-gene': arrayUnique([...accum['ensembl-gene'], ensembl.gene]),
        'ensembl-protein': arrayUnique([...accum['ensembl-protein'], ensembl.protein]),
      };
    } if (ref.$.type === 'HGNC') {
      return {
        ...accum,
        hgnc: Number(ref.$.id.split(':')[1]),
      };
    } if (ref.$.type === 'ProteomicsDB' && !accum.proteomicsdb) {
      return {
        ...accum,
        proteomicsdb: Number(ref.$.id),
      };
    } if (ref.$.type === 'RefSeq') {
      const id = ref.$.id.split('.')[0];
      const value = ref.property[0].$.value.split('.')[0];
      return {
        ...accum,
        refseq: arrayUnique([...accum.refseq, id, value]),
      };
    } if (ref.$.type === 'SGD') {
      return {
        ...accum,
        sgd: ref.$.id,
      };
    }
    return accum;
  }, {
    'ensembl-gene': [],
    'ensembl-protein': [],
    go: { c: [], f: [], p: [] },
    refseq: [],
  })
);

module.exports = getDBRefs;
