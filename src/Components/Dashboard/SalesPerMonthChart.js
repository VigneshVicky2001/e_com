import React, { useEffect, useRef, useState } from 'react';
import { Paper, Box, Typography, Select, MenuItem } from '@mui/material';
import * as d3 from 'd3';
import { SalesPerMonthOfTheYear } from '../../Service/Dashboard.api';

const SalesPerMonthChart = () => {
  const salesLineChartRef = useRef();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [year, setYear] = useState(currentYear);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await SalesPerMonthOfTheYear(year);
        
        if (result.status === "200") {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
  
          const salesTrendData = monthNames.map((month, index) => ({
            month,
            sales: index <= currentMonth || year < currentYear ? Object.values(result.list[index] || { sales: null })[0] : null,
          }));
  
          renderChart(salesTrendData);
        } else {
          console.error('Error: Unexpected response status', result.status);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };
  
    fetchData();
  
    const renderChart = (salesTrendData) => {
      const svg = d3.select(salesLineChartRef.current)
        .attr('width', 740)
        .attr('height', 250);
  
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const width = +svg.attr('width') - margin.left - margin.right;
      const height = +svg.attr('height') - margin.top - margin.bottom;
  
      svg.selectAll("*").remove();
  
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  
      const x = d3.scaleBand()
        .domain(salesTrendData.map(d => d.month))
        .range([0, width]);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(salesTrendData, d => d.sales || 0)])
        .nice()
        .range([height, 0]);
  
      const line = d3.line()
        .defined(d => d.sales !== null)
        .x(d => x(d.month) + x.bandwidth() / 2)
        .y(d => y(d.sales));
  
      // Axes
      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
  
      g.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));
  
      // Line transition
      g.append('path')
        .datum(salesTrendData)
        .attr('fill', 'none')
        .attr('stroke', '#1f77b4')
        .attr('stroke-width', 2)
        .attr('d', line);
  
      const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "5px");
  
      g.selectAll(".dot")
        .data(salesTrendData.filter(d => d.sales !== null))
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.month) + x.bandwidth() / 2)
        .attr("cy", d => y(d.sales))
        .attr("r", 4)
        .attr("fill", "#1f77b4")
        .on("mouseover", (event, d) => {
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(`Month: ${d.month}<br>Sales: ₹${d.sales}`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });
    };
  
  }, [year]);
  

  return (
    <Paper sx={{ padding: 2, backgroundColor: '#ffffff', position: 'relative' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Sales Trend Per Month</Typography>
          <Select value={year} onChange={handleYearChange}>
            {Array.from({ length: currentYear - 2014 }, (_, i) => (
              <MenuItem key={2015 + i} value={2015 + i}>
                {2015 + i}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <svg ref={salesLineChartRef}></svg>
      </Paper>
  )
}

export default SalesPerMonthChart