import * as d3 from "d3"

async function drawScatter() {
  const data = await d3.json("./my_weather_data.json")

  const xAccessor = d => d.dewPoint
  const yAccessor = d => d.humidity
  const colorAccessor = d => d.cloudCover

  console.log(xAccessor(data[0]))
  console.log(yAccessor(data[0]))
  console.log(colorAccessor(data[0]))

  const width = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9,
  ])
  console.log(width)
  const dimensions = {
    width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    }
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.right
    - dimensions.margin.left
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
    //   .style("border", "1px solid")

  const bounds = wrapper.append('g')
    .style('transform', `translate(${
      dimensions.margin.left
    }px, ${
      dimensions.margin.top
    }px)`)

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()
  console.log(xScale.domain())

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()
  console.log(yScale.domain())

  const colorScale = d3.scaleLinear()
    .domain(d3.extent(data, colorAccessor))
    .range(["skyblue", "darkslategray"])
  console.log(colorScale.domain())

  // Nested code is what we'd like to avoid -- hard to maintain
  // No link between the data and the circle as well -- we can only erase it but cannot update it
  // data.forEach(d => {
  //   bounds.append('circle')
  //     .attr('cx', xScale(xAccessor(d)))
  //     .attr('cy', yScale(yAccessor(d)))
  //     .attr('r', 5)
  // })

//   // const dots = bounds.selectAll('circle')
//   //     .data(data).enter().append('circle')
//   //       .attr('cx', d => xScale(xAccessor(d)))
//   //       .attr('cy', d => yScale(yAccessor(d)))
//   //       .attr('r', 5)
//   //       .attr('fill', 'cornflowerblue')

//   const dots = bounds.selectAll('circle')
//       .data(data).join('circle')
//         .attr('cx', d => xScale(xAccessor(d)))
//         .attr('cy', d => yScale(yAccessor(d)))
//         .attr('r', 5)
//         .attr('fill', d => colorScale(colorAccessor(d)))
//   console.log(dots)

//   const xAxisGenerator = d3.axisBottom()
//     .scale(xScale)

//   const xAxis = bounds.append('g')
//       .call(xAxisGenerator)
//       .style('transform', `translateY(${
//         dimensions.boundedHeight
//       }px)`)

//   const xAxisLabel = xAxis.append('text')
//       .attr('x', dimensions.boundedWidth / 2)
//       .attr('y', dimensions.margin.bottom - 10)
//       .attr('fill', 'black')
//       .style('font-size', '1.4em')
//       .html('Dew point (&deg;F)')

//   const yAxisGenerator = d3.axisLeft()
//     .scale(yScale)
//     .ticks(4)

//   const yAxis = bounds.append('g')
//       .call(yAxisGenerator)

//   const yAxisLabel = yAxis.append('text')
//       .attr('x', -dimensions.boundedHeight / 2)
//       .attr('y', -dimensions.margin.left + 10)
//       .style('fill', 'black')
//       .text('Relative humidity')
//       .style('font-size', '1.4em')
//       .style('transform', 'rotate(-90deg)')
//       .style('text-anchor', 'middle')
}

drawScatter()
