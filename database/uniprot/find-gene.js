const findGene = (genes) => {
  const empty = { locus: '', orf: [], primary: '', synonyms: [] };

  if (!genes) return empty;

  const first = Array.isArray(genes) ? genes[0] : genes;
  if (!first || !Array.isArray(first.name)) return empty;

  return first.name.reduce((accum, gene) => {
    const type = gene && gene.$ ? gene.$.type : undefined;
    const text = (gene && typeof gene._ === 'string') ? gene._ : (typeof gene === 'string' ? gene : '');

    if (!text) return accum;

    switch (type) {
      case 'ordered locus':
        return { ...accum, locus: text };

      case 'ORF':
        return { ...accum, orf: [...accum.orf, text] };

      case 'primary':
        return { ...accum, primary: text };

      case 'synonym':
        return { ...accum, synonyms: [...accum.synonyms, text] };

      default:
        return accum;
    }
  }, empty);
};

module.exports = findGene;
