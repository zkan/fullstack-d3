import * as d3 from "d3"

async function drawLineChart() {
  const data = await d3.csv('./data/bob_ross_paintings.csv')
  console.log(data)
}

drawLineChart()
