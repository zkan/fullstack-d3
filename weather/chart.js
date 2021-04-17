import * as d3 from "d3"

async function drawLineChart() {
  const data = await d3.json('./data/my_weather_data.json')
  console.log(data)

  const yAccessor = d => d['temperatureMax']
  console.log(yAccessor(data[0]))

  const parseDate = d3.timeParse('%Y-%m-%d')

  const xAccessor = d => parseDate(d['date'])
  console.log(xAccessor(data[0]))
}

drawLineChart()
