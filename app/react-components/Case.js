import React from 'react';

import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import EntityPageVerticalTable from './components/EntityPageVerticalTable';
import EntityPageHorizontalTable from './components/EntityPageHorizontalTable';

let Case = () => {
  return (
    <Column>
      <Row>heyo</Row>
      <Row>
        {/* <EntityPageVerticalTable
          id="summary"
          title={<span><i className="fa fa-table" /> Summary</span>}
          thToTd={[
            { th: 'Symbol', td: gene.symbol },
            { th: 'Name', td: gene.name },
            { th: 'Synonyms',
              collapsibleTd: gene.synonyms.join(', '),
              style: {
                whiteSpace: 'pre-wrap',
                wordBreak: 'breakWord',
              }
            },
            { th: 'Type', td: gene.biotype },
            { th: 'Location', td:
                `chr${gene.gene_chromosome}:${gene.gene_start}-${gene.gene_end}
                (${(gene.case||[{ssm: [{ncbi_build: '--'}]}])[0].ssm[0].ncbi_build})`
            },
            { th: 'Strand', td: gene.gene_strand},
            { th: 'Description',
              collapsibleTd: gene.description,
              style: {
                whiteSpace: 'pre-wrap',
                wordBreak: 'breakWord',
                lineHeight: '2.2rem',
              }
            },
          ]}
          style={{
            ...styles.summary,
            ...styles.column,
            alignSelf: 'flex-start',
          }}
        /> */}
      </Row>
    </Column>
  )
};

export default Case;
