// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
d3.csv("../data/squirrelActivities.csv", d3.autoType).then(data => {
  console.log(data);

  /** CONSTANTS */
  // constants help us reference the same values throughout our code
  const width = window.width * 7 ,
    height = window.innerHeight /1.5,
    paddingInner = 0.2,
    margin = { top: 100, bottom: 60, left: 50, right: 40 };

  /** SCALES */
  // reference for d3.scales: https://github.com/d3/d3-scale
  const xScale = d3
    .scaleLinear()
    .domain([50, d3.max(data, d => d.count)])
   //.range([height - margin.bottom, margin.top]);
    .range([0, margin.right* 20]);

  const yScale = d3
    .scaleBand()
    .domain(data.map(d => d.activity))
   // .range([0, 100])
    .range([margin.left, height - margin.left-10])
    .paddingInner(0.25);

  const color = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range(["blue", "red", "pink"]);

  const opac = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([0.2, 1])
  
  // reference for d3.axis: https://github.com/d3/d3-axis
  const yAxis = d3.axisRight(yScale).ticks(data.length);

  /** MAIN CODE */
  const svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height );

  // append rects
  const rect = svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => xScale()) 
    .attr("y", d => yScale(d.activity))
    .attr("width", d =>  xScale(d.count)) 
    .attr("height", yScale.bandwidth() )
    .attr("fill", d => color(d.count))
    .attr("opacity", d => opac(d.count))

  // append text
  const text = svg
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("class", "label")
    // this allows us to position the text in the center of the bar
  //  .attr("y", d => yScale(d.activity  + (yScale.bandwidth() / 2)) 
    .attr("y", d => yScale(d.activity) + 15 )
// (yScale.bandwidth() ))
    
    .attr("x", d => xScale(d.count) + 15 )
    .attr("text-anchor", "left")
    .text(d => d.count)
    .attr("dy", "0.9em");

  svg
    .append("g") // creating a group 
    .attr("class", "axis")
    .attr("transform", `rotate(0, ${margin.left, margin.top-10})`)
    .call(yAxis)
    ;
});