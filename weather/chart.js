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

  // Draw data

  const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))
  console.log(lineGenerator)

  const line = bounds.append('path')
      .attr('d', lineGenerator(data))
      .attr('fill', 'none')
      .attr('stroke', '#af9358')
      .attr('stroke-width', 2)

  // Draw peripherals

  const yAxisGenerator = d3.axisLeft()
      .scale(yScale)

  // const yAxis = bounds.append('g')
  // yAxisGenerator(yAxis)

  // Alternatively, code will be concised when use call
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

async function drawScatter() {
  const data = await d3.json('./data/my_weather_data.json')

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

  const wrapper = d3.select('#wrapper-scatter')
    .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      // .style('border', '1px solid')

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
    .range(['skyblue', 'darkslategray'])
  console.log(colorScale.domain())

  // data.forEach(d => {
  //   bounds.append('circle')
  //     .attr('cx', xScale(xAccessor(d)))
  //     .attr('cy', yScale(yAccessor(d)))
  //     .attr('r', 5)
  // })

  // const dots = bounds.selectAll('circle')
  //     .data(data).enter().append('circle')
  //       .attr('cx', d => xScale(xAccessor(d)))
  //       .attr('cy', d => yScale(yAccessor(d)))
  //       .attr('r', 5)
  //       .attr('fill', 'cornflowerblue')

  const dots = bounds.selectAll('circle')
      .data(data).join('circle')
        .attr('cx', d => xScale(xAccessor(d)))
        .attr('cy', d => yScale(yAccessor(d)))
        .attr('r', 5)
        .attr('fill', d => colorScale(colorAccessor(d)))
  console.log(dots)

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append('g')
      .call(xAxisGenerator)
      .style('transform', `translateY(${
        dimensions.boundedHeight
      }px)`)

  const xAxisLabel = xAxis.append('text')
      .attr('x', dimensions.boundedWidth / 2)
      .attr('y', dimensions.margin.bottom - 10)
      .attr('fill', 'black')
      .style('font-size', '1.4em')
      .html('Dew point (&deg;F)')

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4)

  const yAxis = bounds.append('g')
      .call(yAxisGenerator)

  const yAxisLabel = yAxis.append('text')
      .attr('x', -dimensions.boundedHeight / 2)
      .attr('y', -dimensions.margin.left + 10)
      .style('fill', 'black')
      .text('Relative humidity')
      .style('font-size', '1.4em')
      .style('transform', 'rotate(-90deg)')
      .style('text-anchor', 'middle')
}

async function drawBars() {
  const data = await d3.json('./data/my_weather_data.json')

  const xAccessor = d => d.humidity
  console.log(xAccessor(data[0]))
  const yAccessor = d => d.length

  const width = 600
  let dimensions = {
    width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    }
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  const wrapper = d3.select('#wrapper-bars')
    .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)

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

  const binGenerator = d3.bin()
      .domain(xScale.domain())
      .value(xAccessor)
      .thresholds(12) // space between bars -- if we want 13 bars, then we get 12 spaces

  const bins = binGenerator(data)
  console.log(bins)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice()
  console.log(yScale.domain())

  const binsGroup = bounds.append('g')

  const binGroups = binsGroup.selectAll('g')
      .data(bins)
      .join('g')

  const barPadding = 1

  const barRects = binGroups.append('rect')
      .attr('x', d => xScale(d.x0) + barPadding / 2)
      .attr('y', d => yScale(yAccessor(d)))
      .attr('width', d => d3.max([
        0,
        xScale(d.x1) - xScale(d.x0) - barPadding
      ]))
      .attr('height', d => dimensions.boundedHeight - yScale(yAccessor(d)))
      .attr('fill', 'cornflowerblue')

  const barText = binGroups.filter(yAccessor)
      .append('text')
      .attr('x', d => xScale(d.x0) + (
        xScale(d.x1) - xScale(d.x0)
      ) / 2)
      .attr('y', d => yScale(yAccessor(d)) - 5)
      .text(yAccessor)
      .style('text-anchor', 'middle')
      .style('fill', '#666')
      .style('font-size', '12px')
      .style('font-family', 'sans-serif')

  const xAxisGenerator = d3.axisBottom()
      .scale(xScale)
  const xAxis = bounds.append('g')
      .call(xAxisGenerator)
      .style('transform', `translateY(${dimensions.boundedHeight}px)`)
}

drawLineChart()
drawScatter()
drawBars()
