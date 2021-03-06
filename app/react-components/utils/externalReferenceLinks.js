export default {
    hgnc: id => `http://www.genenames.org/data/hgnc_data.php?hgnc_id=${id}`,
    ensembl: id => `http://feb2014.archive.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=${id}`,
    entrez_gene: id => `http://www.ncbi.nlm.nih.gov/gene/${id}`,
    omim_gene: id => `http://omim.org/entry/${id}`,
    uniprotkb_swissprot: id => `http://www.uniprot.org/uniprot/${id}`,
    transcript: id => `http://feb2014.archive.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;t=${id}`,
};
