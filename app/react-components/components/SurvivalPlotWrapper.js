import React, { Component } from 'react';
import { SurvivalPlot } from './SurvivalPlot'; // this component should be merged into this one
import { compose, lifecycle, withState } from 'recompose';
import _ from 'lodash';
import { scaleOrdinal, schemeCategory10 } from 'd3';

import Column from '../uikit/Flex/Column';
import Row from '../uikit/Flex/Row';
import Button from '../Button';
import downloadSvg from '../utils/download-svg';

const colors = scaleOrdinal(schemeCategory10);

export const SurvivalIcon = ({style}) => (
  <svg viewBox="0 0 2048 1536" style={{
    height: '0.8em',
    fill: 'currentcolor',
    ...style,
  }}>
    <path d="m 1917.282,1250.0708 0,-435.00002 c 0,-14 -6.5,-23.83333 -19.5,-29.5 -13,-5.66667 -24.8333,-3.16667 -35.5,7.5 l -121,121.00002 -632.9999,-633.00002 c -6.6667,-6.66667 -14.3334,-10 -23,-10 -8.6667,0 -16.3334,3.33333 -23,10 l -233.00004,233 -416,-416 -192,192 585,585.00002 c 6.66667,6.6667 14.33333,10 23,10 8.66667,0 16.33333,-3.3333 23,-10 l 233.00004,-233.00002 463.9999,464.00002 -121,121 c -10.6667,10.6667 -13.1667,22.5 -7.5,35.5 5.6667,13 15.5,19.5 29.5,19.5 l 435,0 c 9.3333,0 17,-3 23,-9 6,-6 9,-13.6667 9,-23 z"/>
    <path d="m 2048,1408 0,128 L 0,1536 0,0 l 127.99999,0 0,1408 z" />
  </svg>
)

const styles = {
  heading: {
    flexGrow: 1,
    fontSize: '2rem',
    marginBottom: 7,
    marginTop: 7,
  },
  button: {
    color: '#333',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    marginRight: 12,
    minWidth: 46,
    minHeight: 34,
    display: 'inline-flex',
  },
  hidden: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
  pValue: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    fontSize: '1.1rem',
  }
}
const map = {
  defaultId: 'b8a57661-67d1-45d2-a9aa-b9a7a12b12ff'
};

function processData(dataSet, id) {
  return {
    meta: { id },
    donors: _.flatten(dataSet.map(function (interval) {
      return interval.donors.map(function (donor) {
        return _.extend({}, donor, {
          survivalEstimate: interval.cumulativeSurvival,
        });
      });
    })),
  }
}

function buildData(props) {
  return Promise.resolve()
    .then(() => {
      const { gene, rawData } = props;

      if(gene) {
        return fetch(`https://dcc.icgc.org/api/v1/analysis/survival/${map[gene.gene_id] || map.defaultId}`)
          .then(r => r.json())
          .then(geneData => ({ 
            data: [
              processData(geneData.results[0].overall, `${gene}1`),
              processData(geneData.results[1].overall, `${gene}2`),
            ],
            legend: [
              `${gene.survivalId} mutated cases`,
              `${gene.survivalId} not mutated cases`,
            ],
            pValue: geneData.overallStats.pValue
          }));
      }

      return {
        data: [
          processData(rawData, 'project'),
        ],
        legend: ['all cases in project'],
        pValue: '',
      };
    });
}

class SurvivalPlotWrapper extends Component {
  constructor(props) {
    super(props);

    this.onDomainChange = this.onDomainChange.bind(this);

    this.state = {
      xDomain: undefined,
      stack: [],
      palette: [colors(0), colors(1)],
    };

    buildData(this.props).then(d => this.setState(d));
  }

  onDomainChange(xDomain) {
    this.setState({
      stack: this.state.stack.concat(this.state.xDomain),
      xDomain,
    });
  }

  resetXDomain() {
    if(this.state.stack.length){
      return {
        stack: [],
        xDomain: this.state.stack[0],
      };
    } else {
      return {};
    }
  }

  reset() {
    this.props.onReset();
  }

  componentWillReceiveProps(nextProps) {
    buildData(nextProps).then(newState => {
      this.setState({
        ...this.resetXDomain(),
        ...newState,
      });
    });
  }

  render() {
    const { xDomain, data, legend, pValue, palette } = this.state;
    const { height, width } = this.props;

    return (
      <div
        className="survival-plot"
        ref={el => this.container = el}
      >
        <Column id="survival-plot">
          <div style={{textAlign: 'center'}}>Overall Survival Plot</div>
          <span style={{textAlign: 'right'}}>
            <Button
              style={styles.button}
              onClick={
                () => {
                  downloadSvg({
                    svg: this.container.querySelector('svg'),
                    stylePrefix: '.survival-plot',
                    fileName: 'survival-plot.svg',
                  });
                }
              }
            >
              <i className="fa fa-download" /><span style={styles.hidden}>reload</span>
            </Button>
            <Button
              style={styles.button}
              onClick={() => this.reset()}
            >
              <i className="fa fa-undo" /><span style={styles.hidden}>reload</span>
            </Button>
          </span>
          {pValue && <span style={styles.pValue}>Log-Rank Test P-Value = {pValue}</span>}
        </Column>
        {data &&
          <div style={{position: 'relative'}}>
            <SurvivalPlot
              dataSets={data}
              xDomain={xDomain}
              onDomainChange={this.onDomainChange}
              height={height}
              width={width}
              palette={palette}
              margins={{
                top: 15,
                right: 20,
                bottom: 40,
                left: 50,
              }}
            />
          </div>
        }
        <Row style={{justifyContent: 'center', flexWrap: 'wrap'}}>
          {legend &&
            legend.map((text, i) => (
              <div
                key={text}
                style={{
                  color: palette[i],
                  margin: '0 1rem',
                  fontSize: '1.1rem',
                }}
              >{text}</div>
            ))
          }
        </Row>
      </div>
    );
  }
}

SurvivalPlotWrapper.defaultProps = {
  onReset: () => {console.log('reset survival plot')},
}

export default SurvivalPlotWrapper;
