import * as d3 from "d3"

async function drawLineChart() {
  const data = await d3.json('./data/my_weather_data.json')
  console.log(data)

  const yAccessor = d => d['temperatureMax']
  console.log(yAccessor(data[0]))

  const parseDate = d3.timeParse('%Y-%m-%d')

  const xAccessor = d => parseDate(d['date'])
  console.log(xAccessor(data[0]))

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margins: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    }
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margins.left
    - dimensions.margins.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margins.top
    - dimensions.margins.bottom
  console.log(dimensions)

  const wrapper = d3.select('#wrapper')
    .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
  console.log(wrapper)

  const bounds = wrapper.append('g')
      .style('transform', `translate(${
        dimensions.margins.left
      }px, ${
        dimensions.margins.top
      }px)`)
  console.log(bounds)

  const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yAccessor)) // input space: minimum and maximum value
      .range([dimensions.boundedHeight, 0]) // output space

  // This means that if we have a 0, we will plot a point yScale(0) from the top
  console.log(yScale(0))
  console.log(yScale(50))
  console.log(yScale(100))

  const freezingTemperaturePlacement = yScale(32)
  const freezingTemperatures = bounds.append('rect')
      .attr('x', 0)
      .attr('width', dimensions.boundedWidth)
      .attr('y', freezingTemperaturePlacement)
      .attr('height', dimensions.boundedHeight - freezingTemperaturePlacement)
      .attr('fill', '#e0f3f3')

  const xScale = d3.scaleTime()
      .domain(d3.extent(data, xAccessor))
      .range([0, dimensions.boundedWidth])

  const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))
  console.log(lineGenerator)

  const line = bounds.append('path')
      .attr('d', lineGenerator(data))
      .attr('fill', 'none')
      .attr('stroke', '#af9358')
      .attr('stroke-width', 2)
}

drawLineChart()
