// Vender
import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { compose, withState, pure } from 'recompose';

// Custom
import './style.css';
let BarChart = (() => {
  return ({ data, yAxis, styles, chart, setState }) => {
    const el = ReactFauxDOM.createElement('div')

    const margin = {top: 30, right: 50, bottom: 55, left: 30};
    const bandWidth = 36;
    const width = Object.keys(data).length * bandWidth + margin.left + margin.right;
    const height = 200 - margin.top - margin.bottom;

    const x = d3.scaleBand()
    .domain(data.map(d => d.label))
    .rangeRound([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.5);

    const y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data, d => d.value)]);

    const svg = d3.select(el)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g", "chart")
      .attr("fill", "#fff")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    const yG = svg.append("g")
      .call(d3.axisLeft(y)
            .ticks(2)
            .tickSize(-(width))
            .tickSizeOuter(0)
           );
    yG.selectAll("path")
    .style("stroke", "none");
    yG.selectAll("line")
    .style("stroke", (styles.yAxis || {stroke: 'black'}).stroke)
    yG.selectAll("text")
    .style("fill", (styles.yAxis || {textFill: 'black'}).textFill)

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fontSize", "1rem")
      .style("fontWeight", "300")
      .attr("fill", (styles.yAxis || { textFill: 'black' }).textFill)
      .text(yAxis.title || '');

    const xG = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
      xG.selectAll("text")
        .style("text-anchor", "end")
        .attr("fill", (styles.xAxis || { textFill : 'black' }).textFill)
        .attr("dx", "-1em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")
      xG.selectAll("path")
        .style("stroke", (styles.xAxis || {stroke: 'black'}).stroke);
      xG.selectAll("line")
        .style("stroke", (styles.xAxis || {stroke: 'black'}).stroke);

    const barG = svg.selectAll("g.chart")
    .data(data)
    .enter().append("g")
    .attr("class", "bar-g");

    barG.append("rect")
      .attr("class", "bar")
      .attr("fill", (styles.bars || { fill: 'steelblue'}).fill)
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.value))
      .attr("x", (d) => x(d.label))
      .attr("height", (d) => height - y(d.value));

    const barTip = barG.append('g')
      .attr('class', 'bar-tooltip');

    const tipHeight = 25;
    const tipWidth = 55;
    const getTipY = (d) => y(d.value) - tipHeight - 5;
    const getTipX = (d) => x(d.label) + (x.bandwidth()/2) - (tipWidth / 2);
    barTip.append('rect')
      .attr('fill', styles.tooltips.fill)
      .attr('stroke', styles.tooltips.stroke)
      .attr('width', tipWidth)
      .attr('height', tipHeight)
      .attr("ry", "5")
      .attr("rx", "5")
      .attr("y", (d) => getTipY(d))
      .attr("x", (d) => getTipX(d));

    barTip.append('text')
      .attr("y", (d) =>  getTipY(d))
      .attr("x", (d) => getTipX(d) + 5)
      .attr("dy", "1.2em")
      .style("text-anchor", "start")
      .attr("font-size", "1em")
      .attr('fill', styles.tooltips.textFill)
      .text((d) => `${d.value.toFixed(2)}%`);

    return el.toReact();
  }
})();

export default compose(
  withState('chart', 'setState', <span />),
  pure,
)(BarChart);
