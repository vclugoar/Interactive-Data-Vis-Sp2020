/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 80, bottom: 70, left: 100, right: 70 },
  radius = 5;

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let xScale;
let yScale;

/**
 * APPLICATION STATE
 * */
let state = {
  data: [],
  selectedCSD: "All"
};

/**
 * LOAD DATA
 * */
d3.csv("../data/blog3_dataset.csv", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  // SCALES
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.h_score))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(state.data, d => d.perc_poverty))
    .range([height - margin.bottom, margin.top]);

  // AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // UI ELEMENT SETUP
  // add dropdown (HTML selection) for interaction
  // HTML select reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log("new selected CSD is", this.value);
    // `this` === the selectElement
    // this.value holds the dropdown value a user just selected
    state.selectedCSD = this.value;
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data(["All", "M", "Q", "X", "K", "R"]) // unique data values-- (hint: to do this programmatically take a look `Sets`)
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // add the xAxis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Diversity Score");

  // add the yAxis
  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-rl")
    .text("Student Poverty Rate");

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  // filter the data for the selectedParty
  let filteredData = state.data;
  // if there is a selectedParty, filter the data before mapping it to our elements
  if (state.selectedCSD !== "All") {
    filteredData = state.data.filter(d => d.BoroughL === state.selectedCSD);
  }

  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.BoroughL) // use `d.name` as the `key` to match between HTML and data elements
    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append("circle")
          .attr("class", "dot") // Note: this is important so we can identify it in future updates
          .attr("stroke", "lightgrey")
          .attr("opacity", 0.5)
          .attr("fill", d => {
            if (d.BoroughL === "Q") return "blue";
            else if (d.BoroughL === "R") return "green";
            else if (d.BoroughL === "X") return "orange";
            else if (d.BoroughL === "M") return "red"; 
            else return "purple";
          })
          //.ease(500)
          .attr("r", radius)
          .attr("cy", d => yScale(d.perc_poverty))
          .attr("cx", d => margin.left) // initial value - to be transitioned
          .call(enter =>
              enter
                .attr("cx", d => xScale(d.h_score))
               // .easeLinear(50)
                .transition() // initialize transition
                .style("opacity", .9)
                
                .delay(d => 500 * d.h_score) // delay on each element
              //  .duration(500) // duration 500ms
                //.styleTween("background-color",function() { return orangewhite; } )
                
            ),
        update =>
          update.call(update =>
            // update selections -- all data elements that match with a `.dot` element
            update
              .transition()
              .style("opacity", .9)
              .style("size", 12)
              // .attrTween("fill", function() {
              //   return function(t) {
                 
              //   return "hsl(" + t * 360 + ",100%,50%)";
                   
              //   };
              //})
             .duration(250)
             .attr("stroke", "black")
             .transition()
             .duration(250)
             .attr("stroke", "lightgrey")
          ),
        exit =>
          exit.call(exit =>
            // exit selections -- all the `.dot` element that no longer match to HTML elements
            exit
      //        .transition()
             // .delay(d => 50 * d.h_score)
              // .duration(500)
              .attr("cx", width )
              .remove()
        )
    );
}
