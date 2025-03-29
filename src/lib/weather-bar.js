import * as d3 from "d3"

async function drawBars() {
  const data = await d3.json("./my_weather_data.json")

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

    const wrapper = d3.select("#wrapper")
      .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    // For screen reader to know this is a figure
    wrapper.attr("role", "figure")
      .attr("tabindex", "0")
      .append("title")
        .text(`Histogram looking at the distribution of ${metric} over 2019`)

    const bounds = wrapper.append("g")
      .style("transform", `translate(${
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
      .domain([0, d3.max(bins, yAccessor)]) // yAccessor เอาไว้ดูจำนวน object ที่อยู่ใน bin นั้น ๆ
      .range([dimensions.boundedHeight, 0])
      .nice()
    console.log(yScale.domain())

    const binsGroup = bounds.append('g')
      .attr('tabindex', '0')
      .attr('role', 'list')
      .attr('aria-label', 'histogram bars')

    const binGroups = binsGroup.selectAll('g')
      .data(bins)
      .join("g")
        .attr("tabindex", "0")
        .attr("role", "listitem")
        .attr("aria-label", d => `There were ${
          yAccessor(d)
        } days between ${
          d.x0
        } and ${
          d.x1
        } ${
          metric
        } levels`)

    const barPadding = 1

    const barRects = binGroups.append("rect")
      .attr("x", d => xScale(d.x0) + barPadding / 2)
      .attr("y", d => yScale(yAccessor(d)))
      .attr("width", d => d3.max([
        0,
        xScale(d.x1) - xScale(d.x0) - barPadding
      ]))
      .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
      .attr("fill", 'cornflowerblue')

    const barText = binGroups.filter(yAccessor)
      .append("text")
      .attr("x", d => xScale(d.x0) + (
        xScale(d.x1) - xScale(d.x0)
      ) / 2)
      .attr("y", d => yScale(yAccessor(d)) - 5)
      .text(yAccessor)
      .style("text-anchor", "middle")
      .style("fill", "#666")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")

    const mean = d3.mean(data, xAccessor)
    console.log(mean)

    const meanLine = bounds.append("line")
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -15)
      .attr("y2", dimensions.boundedHeight)
      .attr("stroke", "maroon")
      .style("stroke-dasharray", "2px 4px")

    const meanLabel = bounds.append("text")
      .attr("x", xScale(mean))
      .attr("y", -20)
      .text("mean")
      .style("text-anchor", "middle")
      .style("font-family", "sans-serif")
      .style("fill", "maroon")
      .style("font-size", "12px")
      .attr("role", "presentation")
      .attr("aria-hidden", true)

    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)
    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${
        dimensions.boundedHeight
      }px)`)
      .attr("role", "presentation")
      .attr("aria-hidden", true)

    const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .text(metric)
      .attr("role", "presentation")
      .attr("aria-hidden", true)
  }

  const metrics = [
    "humidity",
    "windSpeed",
    "dewPoint",
    "uvIndex",
    "visibility",
    "temperatureMax",
    "cloudCover",
  ]
  metrics.forEach(drawHistogram)
}

drawBars()
