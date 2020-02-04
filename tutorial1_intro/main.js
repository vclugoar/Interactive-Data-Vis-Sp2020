// load csv 
d3.csv("../../data/cereal.csv").then(data => {
    // once the data loads, console log it 
    console.log("data", data);

    // select the table container in the HTML
    const table = d3.select("#d3-table"); 

    // ** Header **/
    const thead = table.append("thead"); 
    thead
        .append("tr")
        .append("th")
        .attr("colspan", "7")
        .text("Different Cereals");

        

    thead
        .append("tr")
        .selectAll("th")
        .data(data.columns)
        .join("td")
        .attr("class", d => d == "protein" ? 'high' : null)
        .text(d => d); 
    
    
    /** Body **/
    // rows 
    const rows = table 
        .append("tbody")
        .selectAll("tr")
        .data(data)
        .join("tr")
        ;


    // cells 
    rows
        .selectAll("td")
        .data(d => Object.values(d))
        .join("td")
        .attr("class", d => d == "protein" ? 'high' : null)
        .text(d => d)
        ;
    
    })