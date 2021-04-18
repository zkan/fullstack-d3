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
  dimensions.boundedWidth = dimensions.width - dimensions.margins.left - dimensions.margins.right
  dimensions.boundedHeight = dimensions.height - dimensions.margins.top - dimensions.margins.bottom
  console.log(dimensions)

  const wrapper = d3.select('#wrapper')
  console.log(wrapper)
}

drawLineChart()
