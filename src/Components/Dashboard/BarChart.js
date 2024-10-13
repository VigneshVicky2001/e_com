import React, { useEffect, useRef, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import * as d3 from 'd3';
import { GetStockQtyForAllItems } from '../../Service/Dashboard.api';

const BarChart = ({ stockLevelsData }) => {
  const stockBarChartRef = useRef();

  useEffect(() => {
    if (!stockLevelsData || stockLevelsData.length === 0) return;

    // Clear previous content for re-rendering
    d3.select(stockBarChartRef.current).selectAll('*').remove();

    // Define the size of the chart and handle longer data dynamically
    const barWidth = 60;
    const chartWidth = Math.max(stockLevelsData.length * barWidth, 500);
    const chartHeight = 300;
    
    const svg = d3.select(stockBarChartRef.current)
      .attr('width', chartWidth)
      .attr('height', chartHeight);

    const margin = { top: 20, right: 30, bottom: 70, left: 50 };
    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X and Y scales
    const x = d3.scaleBand()
      .domain(stockLevelsData.map(d => d.item))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(stockLevelsData, d => d.quantity)])
      .nice()
      .range([height, 0]);

    // Axes
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-30)")  // Less rotation
      .style("text-anchor", "end")
      .style("font-size", "12px");

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y).ticks(6));

    // Bars with color and hover effect
    g.selectAll('.bar')
      .data(stockLevelsData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.item))
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', '#3f51b5')  // Primary bar color
      .on('mouseover', function () {
        d3.select(this).transition().duration(200).attr('fill', '#5c6bc0');
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(200).attr('fill', '#3f51b5');
      })
      .transition()
      .duration(1500)
      .attr('y', d => y(d.quantity))
      .attr('height', d => height - y(d.quantity));

    g.selectAll('.bar-label')
      .data(stockLevelsData)
      .enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', d => x(d.item) + x.bandwidth() / 2)
      .attr('y', d => y(d.quantity) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'black')
      .text(d => d.quantity);
  }, [stockLevelsData]);

  return (
    <Paper sx={{ padding: 2, backgroundColor: '#ffffff' }}>
      <Typography variant="h6" gutterBottom>Stock Levels</Typography>
      <div style={{ overflowX: 'auto' }}>
        <svg ref={stockBarChartRef}></svg>
      </div>
    </Paper>
  );
};

const StockLevelDashboard = () => {
  const [stockLevelsData, setStockLevelsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetStockQtyForAllItems();
        if (result.status === "200") {
          const formattedData = result.list.map(item => ({
            item: item.itemName,
            quantity: item.stockQuantity,
          }));
          setStockLevelsData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching stock levels:', error);
      }
    };

    fetchData();
  }, []);

  return <BarChart stockLevelsData={stockLevelsData} />;
};

export default StockLevelDashboard;
