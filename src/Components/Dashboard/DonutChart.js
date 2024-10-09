import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DonutChart = ({ paymentMethodsData, paymentDonutChartRef }) => {
  useEffect(() => {
    const svg = d3.select(paymentDonutChartRef.current)
      .attr('width', 400)
      .attr('height', 250)
      .append('g')
      .attr('transform', 'translate(200,125)');

    const color = d3.scaleOrdinal(d3.schemeSet3);

    const arc = d3.arc()
      .outerRadius(100)
      .innerRadius(50);

    const pie = d3.pie()
      .value(d => d.percentage);

    const arcs = svg.selectAll('.arc')
      .data(pie(paymentMethodsData))
      .enter().append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('fill', d => color(d.data.method))
      .transition()
      .duration(1000)
      .attrTween('d', function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return t => arc(i(t));
      });

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .style('opacity', 0)
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1)
      .text(d => `${d.data.percentage}%`);
  }, [paymentMethodsData, paymentDonutChartRef]);

  return <svg ref={paymentDonutChartRef}></svg>;
};

export default DonutChart;
