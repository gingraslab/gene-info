/* eslint no-console: 0 */

const convertXML = require('../helpers/convert-xml');
const getDBRefs = require('./get-dbrefs');
const xmlEntry = require('../files/example/xml-entry');

let exampleEntry;
beforeAll(async () => {
  ({ entry: exampleEntry } = await convertXML(xmlEntry));
});

describe('DB refs', () => {
  describe('entry with full information', () => {
    let refs;

    beforeAll(() => {
      refs = getDBRefs(exampleEntry.dbReference);
    });

    it('should return biocyc ID', () => {
      const expected = 'CTPSYN-MONOMER';
      expect(refs.biocyc).toBe(expected);
    });

    it('should return biogrid ID', () => {
      const expected = 116400;
      expect(refs.biogrid).toBe(expected);
    });

    it('should return dictybase ID', () => {
      const expected = 'DDB_G0286499';
      expect(refs.dictybase).toBe(expected);
    });

    it('should return flybase ID', () => {
      const expected = 'flybaseTest';
      expect(refs.flybase).toBe(expected);
    });

    it('should return gene ID', () => {
      const expected = 11235;
      expect(refs.geneid).toBe(expected);
    });

    it('should return go terms', () => {
      const expected = {
        c: [
          { id: '0005737', term: 'cytoplasm' },
          { id: '0005829', term: 'cytosol' },
          { id: '0070062', term: 'extracellular exosome' },
          { id: '0005794', term: 'Golgi apparatus' },
          { id: '0000139', term: 'Golgi membrane' },
          { id: '0005886', term: 'plasma membrane' },
        ],
        f: [
          { id: '0042803', term: 'protein homodimerization activity' },
          { id: '0019901', term: 'protein kinase binding' },
          { id: '0047485', term: 'protein N-terminus binding' },
        ],
        p: [
          { id: '0001525', term: 'angiogenesis' },
          { id: '1990830', term: 'cellular response to leukemia inhibitory factor' },
          { id: '0051683', term: 'establishment of Golgi localization' },
          { id: '0090168', term: 'Golgi reassembly' },
          { id: '0036481', term: 'intrinsic apoptotic signaling pathway in response to hydrogen peroxide' },
          { id: '0043066', term: 'negative regulation of apoptotic process' },
          { id: '1903588', term: 'negative regulation of blood vessel endothelial cell proliferation involved in sprouting angiogenesis' },
          { id: '0090051', term: 'negative regulation of cell migration involved in sprouting angiogenesis' },
          { id: '0010629', term: 'negative regulation of gene expression' },
          { id: '0030335', term: 'positive regulation of cell migration' },
          { id: '0008284', term: 'positive regulation of cell proliferation' },
          { id: '0010628', term: 'positive regulation of gene expression' },
          { id: '0090316', term: 'positive regulation of intracellular protein transport' },
          { id: '0043406', term: 'positive regulation of MAP kinase activity' },
          { id: '0045747', term: 'positive regulation of Notch signaling pathway' },
          { id: '0033138', term: 'positive regulation of peptidyl-serine phosphorylation' },
          { id: '0071902', term: 'positive regulation of protein serine/threonine kinase activity' },
          { id: '0032874', term: 'positive regulation of stress-activated MAPK cascade' },
          { id: '0050821', term: 'protein stabilization' },
          { id: '0042542', term: 'response to hydrogen peroxide' },
          { id: '0044319', term: 'wound healing, spreading of cells' },
        ],
      };
      expect(refs.go).toEqual(expected);
    });

    it('should return ensembl gene IDs', () => {
      const expected = ['ENSG00000114209'];
      expect(refs['ensembl-gene']).toEqual(expected);
    });

    it('should return ensembl protein IDs', () => {
      const expected = [
        'ENSP00000376506',
        'ENSP00000420021',
        'ENSP00000417202',
        'ENSP00000418317',
        'ENSP00000420553',
      ];
      expect(refs['ensembl-protein']).toEqual(expected);
    });

    it('should return hgnc ID', () => {
      const expected = 8761;
      expect(refs.hgnc).toBe(expected);
    });

    it('should return MGI ID', () => {
      const expected = 'MGITest';
      expect(refs.mgi).toBe(expected);
    });

    it('should return MIM ID', () => {
      const expected = 609118;
      expect(refs.mim).toBe(expected);
    });

    it('should return pathways', () => {
      const expected = [
        {
          id: 'R-HSA-2995383',
          term: 'Initiation of Nuclear Envelope Reformation',
        },
        {
          id: 'R-HSA-69231',
          term: 'Cyclin D associated events in G1',
        },
      ];
      expect(refs.pathway).toEqual(expected);
    });

    it('should return PomBase ID', () => {
      const expected = 'SPAC24B11.06c';
      expect(refs.pombase).toBe(expected);
    });

    it('should return first proteomics DB ID', () => {
      const expected = 79108;
      expect(refs.proteomicsdb).toBe(expected);
    });

    it('should return refseq IDs', () => {
      const expected = [
        'NP_009148',
        'NM_007217',
        'NP_665858',
        'NM_145859',
        'NP_665859',
        'NM_145860',
        'XP_005247143',
        'XM_005247086',
        'XP_005247144',
        'XM_005247087',
        'XP_005247145',
        'XM_005247088',
        'XP_006713548',
        'XM_006713485',
        'XP_011510670',
        'XM_011512368',
        'XP_011510671',
        'XM_011512369',
        'XP_016861133',
        'XM_017005644',
      ];
      expect(refs.refseq).toEqual(expected);
    });

    it('should return sgd ID', () => {
      const expected = 'SGDTest';
      expect(refs.sgd).toBe(expected);
    });

    it('should return TAIR ID', () => {
      const expected = 'locus:2196506';
      expect(refs.tair).toBe(expected);
    });

    it('should return wormbase ID', () => {
      const expected = 'WBGene00003920';
      expect(refs.wormbase).toBe(expected);
    });

    it('should return wormbase wormIsoforms', () => {
      const expected = ['M117.2a', 'M117.2b'];
      expect(refs.wormIsoforms).toEqual(expected);
    });

    it('should return xenbase ID', () => {
      const expected = 'XB-GENE-984751';
      expect(refs.xenbase).toBe(expected);
    });

    it('should return ZFIN ID', () => {
      const expected = 'ZFINTest';
      expect(refs.zfin).toBe(expected);
    });
  });

  describe('entry with no information', () => {
    let refs;

    beforeAll(() => {
      refs = getDBRefs([]);
    });

    it('should not return biocyc ID', () => {
      expect(refs.biocyc).toBeFalsy();
    });

    it('should not return biogrid ID', () => {
      expect(refs.biogrid).toBeFalsy();
    });

    it('should not return dictybase ID', () => {
      expect(refs.dictybase).toBeFalsy();
    });

    it('should not return flybase ID', () => {
      expect(refs.flybase).toBeFalsy();
    });

    it('should not return gene ID', () => {
      expect(refs.geneid).toBeFalsy();
    });

    it('should not return go terms', () => {
      const expected = {
        c: [],
        f: [],
        p: [],
      };
      expect(refs.go).toEqual(expected);
    });

    it('should return empty array for ensembl gene IDs', () => {
      const expected = [];
      expect(refs['ensembl-gene']).toEqual(expected);
    });

    it('should return empty array for ensembl protein IDs', () => {
      const expected = [];
      expect(refs['ensembl-protein']).toEqual(expected);
    });

    it('should not return hgnc ID', () => {
      expect(refs.hgnc).toBeFalsy();
    });

    it('should not return mgi ID', () => {
      expect(refs.mgi).toBeFalsy();
    });

    it('should not return proteomics DB ID', () => {
      expect(refs.proteomicsdb).toBeFalsy();
    });

    it('should return empty array for refseq IDs', () => {
      const expected = [];
      expect(refs.refseq).toEqual(expected);
    });

    it('should not return sgd ID', () => {
      expect(refs.sgd).toBeFalsy();
    });

    it('should not return tair ID', () => {
      expect(refs.tair).toBeFalsy();
    });

    it('should not return wormbase ID', () => {
      expect(refs.wormbase).toBeFalsy();
    });

    it('should not return xenbase ID', () => {
      expect(refs.xenbase).toBeFalsy();
    });

    it('should not return zfin ID', () => {
      expect(refs.zfin).toBeFalsy();
    });
  });
});
