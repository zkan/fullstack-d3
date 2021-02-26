import * as d3 from "d3"

async function drawLineChart() {
  const data = await d3.json('./data/my_weather_data.json')
  console.log(data)
}

drawLineChart()