import * as d3 from "d3"

async function drawLineChart() {
  const data = await d3.csv('./data/bob_ross_paintings.csv')
  console.log(data)

  const yAccessor = d => +d['num_colors']
  console.log(yAccessor(data[0]))

  const xAccessor = d => +d['']
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
      .domain(d3.extent(data, yAccessor))
      .range([dimensions.boundedHeight, 0])

      const xScale = d3.scaleTime()
      .domain(d3.extent(data, xAccessor))
      .range([0, dimensions.boundedWidth])

  // Draw data

  const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))

  const line = bounds.append('path')
      .attr('d', lineGenerator(data))
      .attr('fill', 'none')
      .attr('stroke', 'green')
      .attr('stroke-width', 2)

  // Draw peripherals

  const yAxisGenerator = d3.axisLeft()
      .scale(yScale)

  const yAxis = bounds.append('g')
      .call(yAxisGenerator)

  const xAxisGenerator = d3.axisBottom()
      .scale(xScale)

  const xAxis = bounds.append('g')
      .call(xAxisGenerator)
      .style('transform', `translateY(${
        dimensions.boundedHeight
      }px)`)
}

drawLineChart()
