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
}

drawLineChart()
