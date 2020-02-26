/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5,
  default_selection = "Select a Movement";

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;
let xAxis; 

/* APPLICATION STATE */
let state = {
  data: [],
  selectedMovement: "All", // + YOUR FILTER SELECTION
};

/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv("../data/quantified.csv", d => ({
  year: new Date(d.week, 0, 1),
  movement: d.Movement,
  count: +d.onemax,
})).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // SCALES
  xScale = d3
    .scaleTime()
    .domain(d3.extent(state.data, d => d.year))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain([0, d3.max(state.data, d => d.count)])
    .range([height - margin.bottom, margin.top]);

  // AXES
  const xAxis = d3.axisBottom(xScale);
  yAxis = d3.axisLeft(yScale); // deleted format here 

  // UI ELEMENT SETUP
  const selectElement = d3.select("#dropdown").on("change", function() {
    // `this` === the selectElement
    // 'this.value' holds the dropdown value a user just selected
    state.selectedMovement = this.value; // + UPDATE STATE WITH YOUR SELECTED VALUE
    console.log("new value is", this.value);
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
  .selectAll("option")
  .data([
    ...Array.from(new Set(state.data.map(d => d.movement))),
    default_selection,
  ])
  .join("option")
  .attr("value", d => d)
  .text(d => d);


  // + SET SELECT ELEMENT'S DEFAULT VALUE (optional)
  // this ensures that the selected value is the same as what we have in state when we initialize the options
  selectElement.property("value", default_selection);

  // + CREATE SVG ELEMENT
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // + CALL AXES
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Year");

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
    .text("Count");

  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  // + FILTER DATA BASED ON STATE
  let filteredData;
  if (state.selectedMovement !== null) {
    filteredData = state.data.filter(d => d.movement=== state.selectedMovement);
  }
// update the scale domain (now that our data has changed)
yScale.domain([0, d3.max(filteredData, d => d.count)]);

// re-draw our yAxix since our yScale is updated with the new data
d3.select("g.y-axis")
  .transition()
  .duration(1000)
  .call(yAxis.scale(yScale)); // this updates the yAxis' scale to be our newly updated one

// we define our line function generator telling it how to access the x,y values for each point
const lineFunc = d3
  .line()
  .x(d => xScale(d.year))
  .y(d => yScale(d.count));

 const dot = svg
  .selectAll(".dot")
  .data(filteredData, d => d.year) // use `d.year` as the `key` to match between HTML and data elements
  .join(
    enter =>
      // enter selections -- all data elements that don't have a `.dot` element attached to them yet
      enter
        .append("circle")
        .attr("class", "dot") // Note: this is important so we can identify it in future updates
        .attr("r", radius)
        .attr("cy", height - margin.bottom) // initial value - to be transitioned
        .attr("cx", d => xScale(d.year)),
    update => update,
    exit =>
      exit.call(exit =>
        // exit selections -- all the `.dot` element that no longer match to HTML elements
        exit
          .transition()
        //  .delay(d => d.year)
         // .duration(500)
       //   .attr("cy", height - margin.bottom)
          .remove()
      )
  )
  // the '.join()' function leaves us with the 'Enter' + 'Update' selections together.
  // Now we just need move them to the right place
  .call(
    selection =>
      selection
        .transition() // initialize transition
        .duration(500) // duration 1000ms / 1s
        .attr("cy", d => yScale(d.count)) // started from the bottom, now we're here
  );

const line = svg
  .selectAll("path.trend")
  .data([filteredData])
  .join(
    enter =>
      enter
        .append("path")
        .attr("class", "trend")
        .attr("opacity", 0), // start them off as opacity 0 and fade them in
    update => update, // pass through the update selection
    exit => exit.remove()
  )
  .call(selection =>
    selection
      .transition() // sets the transition on the 'Enter' + 'Update' selections together.
      .duration(1000)
      .attr("opacity", .1)
      .attr("d", d => lineFunc(d))
  );
  

}
