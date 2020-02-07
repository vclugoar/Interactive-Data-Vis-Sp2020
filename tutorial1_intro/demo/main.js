// load in csv
d3.csv("../../data/surveyResults.csv").then(data => {
  // once the data loads, console log it
  console.log("data", data);

  // select the `table` container in the HTML
  const table = d3.select("#d3-table");

  /** HEADER */
  const thead = table.append("thead");
  thead
    .append("tr")
    .append("th")
    .attr("colspan", "7")
    .text("Pre-Survey Results");

  thead
    .append("tr")
    .selectAll("th")
    .data(data.columns)
    .join("td")
    .text(d => d);

  /** BODY */
  // rows
  const rows = table
    .append("tbody")
    .selectAll("tr")
    .data(data)
    .join("tr")
    .attr("class", d => { 
      let tag ; 
      // could also do d.timestamp if it's one word. if there are spaces need the " " 
      if (+d["Python or R (or any data analysis tool)"] > 3) { 
          tag = "python"; 
      }
      
      if (+d["Terminal (Bash/Zsh)"] > 2) { 
        tag = "terminal"; 
      }
      //console.log(d);
      return tag; 
    }) 

  // cells
  rows
    .selectAll("td")
    .data(d => Object.values(d))
    .join("td")
    // update the below logic to apply to your dataset
    .attr("class", d => +d > 3 ? 'high' : null)
    .text(d => d);
});
