import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieChart = ({ categoriesData, categoriesPieChartRef }) => {
  useEffect(() => {
    const width = 400;
    const height = 250;
    const radius = Math.min(width, height) / 2 - 20;

    const svg = d3.select(categoriesPieChartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 3},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(categoriesData.map(d => d.category))
      .range(d3.schemeCategory10);

    const pie = d3.pie()
      .value(d => d.quantity);

    const arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(0);

    const arcs = svg.selectAll('.arc')
      .data(pie(categoriesData))
      .enter().append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.category))
      .transition()
      .ease(d3.easeBounce)
      .duration(1500)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return t => arc(i(t));
      });
  }, [categoriesData, categoriesPieChartRef]);

  return <svg ref={categoriesPieChartRef}></svg>;
};

export default PieChart;
