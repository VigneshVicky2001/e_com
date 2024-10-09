import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ stockLevelsData, stockBarChartRef }) => {
  useEffect(() => {
    const svg = d3.select(stockBarChartRef.current)
      .attr('width', 400)
      .attr('height', 250);

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(stockLevelsData.map(d => d.item))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(stockLevelsData, d => d.quantity)])
      .nice()
      .range([height, 0]);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    g.selectAll('.bar')
      .data(stockLevelsData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.item))
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .transition()
      .duration(1500)
      .attr('y', d => y(d.quantity))
      .attr('height', d => height - y(d.quantity));
  }, [stockLevelsData, stockBarChartRef]);

  return <svg ref={stockBarChartRef}></svg>;
};

export default BarChart;
