import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, Grid, Paper, Select, Typography, MenuItem } from '@mui/material';
import { SalesPerMonthOfTheYear, SalesPerDayOfTheMonth, GetStockQtyForAllItems } from '../../Service/Dashboard.api';
import SalesPerMonthChart from './SalesPerMonthChart';
import SalesPerDayChart from './SalesPerDayChart';
import BarChart from './BarChart';

const Dashboard = () => {
  const categoriesPieChartRef = useRef();
  const paymentDonutChartRef = useRef();
  const heatmapRef = useRef();
  const bubbleChartRef = useRef();
  const gaugeChartRef = useRef();
  const [salesTrendData, setSalesTrendData] = useState([]);

  // Sample Data
  // const salesTrendData = [
    // { month: 'January', sales: 1000 },
    // { month: 'February', sales: 1500 },
    // { month: 'March', sales: 1300 },
    // { month: 'April', sales: 1700 },
    // { month: 'May', sales: 1600 },
  // ];

  const categoriesData = [
    { category: 'Fruits', quantity: 30 },
    { category: 'Vegetables', quantity: 50 },
    { category: 'Dairy', quantity: 20 },
    { category: 'Meat', quantity: 10 },
  ];

  const stockLevelsData = [
    { item: 'Bananas', quantity: 150 },
    { item: 'Apples', quantity: 200 },
    { item: 'Milk', quantity: 100 },
    { item: 'Chicken', quantity: 50 },
  ];

  const paymentMethodsData = [
    { method: 'Cash', percentage: 40 },
    { method: 'Card', percentage: 35 },
    { method: 'Online', percentage: 25 },
  ];

  const distributorData = [
    { distributor: 'ABC Distributors', quantity: 300 },
    { distributor: 'Fresh Farms', quantity: 200 },
    { distributor: 'Dairy Co.', quantity: 100 },
  ];

  const salesPerDay = [
    { day: 'Monday', sales: 500 },
    { day: 'Tuesday', sales: 600 },
    { day: 'Wednesday', sales: 550 },
    { day: 'Thursday', sales: 700 },
    { day: 'Friday', sales: 900 },
    { day: 'Saturday', sales: 1200 },
    { day: 'Sunday', sales: 1000 },
  ];


// D3 Pie Chart for Categories
// useEffect(() => {
//   const width = 400; // Increase width to provide more space
//   const height = 250;
//   const radius = Math.min(width, height) / 2 - 20; // Adjusted radius for more spacing

//   const svg = d3.select(categoriesPieChartRef.current)
//     .attr('width', width)
//     .attr('height', height)
//     .append('g')
//     .attr('transform', `translate(${width / 3},${height / 2})`);

//   const color = d3.scaleOrdinal()
//     .domain(categoriesData.map(d => d.category))
//     .range(d3.schemeCategory10);

//   const pie = d3.pie()
//     .value(d => d.quantity);

//   const arc = d3.arc()
//     .outerRadius(radius)
//     .innerRadius(0);

//   const arcs = svg.selectAll('.arc')
//     .data(pie(categoriesData))
//     .enter().append('g')
//     .attr('class', 'arc');

//   arcs.append('path')
//     .attr('d', arc)
//     .attr('fill', d => color(d.data.category))
//     .transition()
//     .ease(d3.easeBounce)
//     .duration(1500)
//     .attrTween("d", function(d) {
//       const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
//       return t => arc(i(t));
//     });

//   // Adjust the legend creation and positioning
//   const legendGroup = svg.append('g')
//     .attr('transform', `translate(${radius + 30}, -100)`); // Moved legend farther to the right

//   const legend = legendGroup.selectAll('.legend')
//     .data(categoriesData)
//     .enter().append('g')
//     .attr('class', 'legend')
//     .attr('transform', (d, i) => `translate(0, ${i * 20})`);

//   // Adjust size and spacing for the legend
//   legend.append('rect')
//     .attr('width', 18)
//     .attr('height', 18)
//     .style('fill', d => color(d.category));

//   legend.append('text')
//     .attr('x', 24) // Increase the distance between the rect and text
//     .attr('y', 9)
//     .attr('dy', '.35em')
//     .text(d => d.category);

//   // Apply transition to the entire legend group after it's properly created
//   legendGroup
//     .style('opacity', 0)
//     .transition()
//     .duration(1000)
//     .delay((d, i) => i * 200)
//     .style('opacity', 1);
// }, []);
  
//   useEffect(() => {
//     const svg = d3.select(stockBarChartRef.current)
//       .attr('width', 400)
//       .attr('height', 250);
  
//     const margin = { top: 20, right: 30, bottom: 30, left: 40 };
//     const width = +svg.attr('width') - margin.left - margin.right;
//     const height = +svg.attr('height') - margin.top - margin.bottom;
  
//     const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  
//     const x = d3.scaleBand()
//       .domain(stockLevelsData.map(d => d.item))
//       .range([0, width])
//       .padding(0.2);
  
//     const y = d3.scaleLinear()
//       .domain([0, d3.max(stockLevelsData, d => d.quantity)])
//       .nice()
//       .range([height, 0]);
  
//     g.append('g')
//       .attr('class', 'x-axis')
//       .attr('transform', `translate(0,${height})`)
//       .call(d3.axisBottom(x));
  
//     g.append('g')
//       .attr('class', 'y-axis')
//       .call(d3.axisLeft(y));
  
//     g.selectAll('.bar')
//       .data(stockLevelsData)
//       .enter().append('rect')
//       .attr('class', 'bar')
//       .attr('x', d => x(d.item))
//       .attr('width', x.bandwidth())
//       .attr('y', height)  // Start bars from the bottom
//       .attr('height', 0)  // Initial height is zero
//       .transition()
//       .duration(1500)     // Duration of the animation
//       .attr('y', d => y(d.quantity))  // Transition to final position
//       .attr('height', d => height - y(d.quantity));  // Grow to final height
//   }, []);
  
//   useEffect(() => {
//   const svg = d3.select(paymentDonutChartRef.current)
//     .attr('width', 400)
//     .attr('height', 250)
//     .append('g')
//     .attr('transform', 'translate(200,125)');

//   const color = d3.scaleOrdinal(d3.schemeSet3);

//   const arc = d3.arc()
//     .outerRadius(100)
//     .innerRadius(50);

//   const pie = d3.pie()
//     .value(d => d.percentage);

//   const arcs = svg.selectAll('.arc')
//     .data(pie(paymentMethodsData))
//     .enter().append('g')
//     .attr('class', 'arc');

//   arcs.append('path')
//     .attr('fill', d => color(d.data.method))
//     .transition()
//     .duration(1000)
//     .attrTween('d', function(d) {
//       const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
//       return t => arc(i(t));
//     });

//   arcs.append('text')
//     .attr('transform', d => `translate(${arc.centroid(d)})`)
//     .attr('dy', '0.35em')
//     .style('text-anchor', 'middle')
//     .style('opacity', 0)  // Start text hidden
//     .transition()
//     .delay(1000)           // Delay until the slice is drawn
//     .duration(500)         // Fade-in animation
//     .style('opacity', 1)
//     .text(d => `${d.data.percentage}%`);
// }, []);


  return (
    <Box sx={{ padding: 4, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SalesPerMonthChart />
        </Grid>


        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2, backgroundColor: '#ffffff' }}>
            <Typography variant="h6">Category Distribution</Typography>
            <svg ref={categoriesPieChartRef}></svg>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <SalesPerDayChart />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <BarChart />
        </Grid>

        {/* Payment Methods Donut Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2, backgroundColor: '#ffffff' }}>
            <Typography variant="h6">Payment Methods</Typography>
            <svg ref={paymentDonutChartRef}></svg>
          </Paper>
        </Grid>

        {/* Heatmap for Sales per Day */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2, backgroundColor: '#ffffff' }}>
            <Typography variant="h6">Sales per Day</Typography>
            <svg ref={heatmapRef}></svg>
          </Paper>
        </Grid>

        {/* Bubble Chart for Distributor Data */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2, backgroundColor: '#ffffff' }}>
            <Typography variant="h6">Distributor Contributions</Typography>
            <svg ref={bubbleChartRef}></svg>
          </Paper>
        </Grid>

        {/* Gauge Chart for Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2, backgroundColor: '#ffffff' }}>
            <Typography variant="h6">Performance Metrics</Typography>
            <svg ref={gaugeChartRef}></svg>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;
