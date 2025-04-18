import * as d3 from "d3"

async function drawLineChart() {
  const data = await d3.json("./my_weather_data.json")
  console.log(data)

  // Accessor functions to convert a single data point into metric value
  const yAccessor = d => d["temperatureMax"]
  console.log(yAccessor(data[0]))

  const parseDate = d3.timeParse("%Y-%m-%d")

  const xAccessor = d => parseDate(d["date"])
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

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
  console.log(wrapper)

  const bounds = wrapper.append("g")
    .style("transform", `translate(${
      dimensions.margins.left
    }px, ${
      dimensions.margins.top
    }px)`)
  console.log(bounds)

  const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yAccessor)) // input space: minimum and maximum value
      .range([dimensions.boundedHeight, 0]) // output space

  console.log(d3.extent(data, yAccessor))

  // This means that if we have a 0, we will plot a point yScale(0) from the top
  console.log(yScale(0))
  console.log(yScale(13.02))
  console.log(yScale(50))
  console.log(yScale(100))

  const freezingTemperaturePlacement = yScale(32)
  const freezingTemperatures = bounds.append("rect")
      .attr("x", 0)
      .attr("width", dimensions.boundedWidth)
      .attr("y", freezingTemperaturePlacement)
      .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
      .attr("fill", "#e0f3f3")

  const xScale = d3.scaleTime()
      .domain(d3.extent(data, xAccessor))
      .range([0, dimensions.boundedWidth])

  // Draw data
  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))
  console.log(lineGenerator)

  const line = bounds.append("path")
    .attr("d", lineGenerator(data))
    .attr("fill", "none")
    .attr("stroke", "#af9358")
    .attr("stroke-width", 2)

  // Draw peripherals
  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)

  // const yAxis = bounds.append('g')
  // yAxisGenerator(yAxis)

  // Alternatively, code will be concised when use call
  const yAxis = bounds.append("g")
    .call(yAxisGenerator)

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${
      dimensions.boundedHeight
    }px)`)
}

async function drawBars() {
  const data = await d3.json('../../data/my_weather_data.json')

  const drawHistogram = metric => {
    const xAccessor = d => d[metric]
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

    // For screen reader to know this is a figure
    wrapper.attr('role', 'figure')
        .attr('tabindex', '0')
      .append('title')
        .text(`Histogram looking at the distribution of ${metric} over 2019`)

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
        .attr('tabindex', '0')
        .attr('role', 'list')
        .attr('aria-label', 'histogram bars')

    const binGroups = binsGroup.selectAll('g')
        .data(bins)
        .join('g')
          .attr('tabindex', '0')
          .attr('role', 'listitem')
          .attr('aria-label', d => `There were ${
            yAccessor(d)
          } days between ${
            d.x0
          } and ${
            d.x1
          } ${
            metric
          } levels`)

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

    const mean = d3.mean(data, xAccessor)
    console.log(mean)

    const meanLine = bounds.append('line')
        .attr('x1', xScale(mean))
        .attr('x2', xScale(mean))
        .attr('y1', -15)
        .attr('y2', dimensions.boundedHeight)
        .attr('stroke', 'maroon')
        .style('stroke-dasharray', '2px 4px')

    const meanLabel = bounds.append('text')
        .attr('x', xScale(mean))
        .attr('y', -20)
        .text('mean')
        .style('text-anchor', 'middle')
        .style('font-family', 'sans-serif')
        .style('fill', 'maroon')
        .style('font-size', '12px')
        .attr('role', 'presentation')
        .attr('aria-hidden', true)

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
    const xAxis = bounds.append('g')
        .call(xAxisGenerator)
        .style('transform', `translateY(${
          dimensions.boundedHeight
        }px)`)
        .attr('role', 'presentation')
        .attr('aria-hidden', true)

    const xAxisLabel = xAxis.append('text')
        .attr('x', dimensions.boundedWidth / 2)
        .attr('y', dimensions.margin.bottom - 10)
        .attr('fill', 'black')
        .style('font-size', '1.4em')
        .text(metric)
        .attr('role', 'presentation')
        .attr('aria-hidden', true)
  }

  const metrics = [
    'humidity',
    'windSpeed',
    'dewPoint',
    'uvIndex',
    'visibility',
    'temperatureMax',
    'cloudCover',
  ]
  metrics.forEach(drawHistogram)
}

drawLineChart()
// drawBars()
