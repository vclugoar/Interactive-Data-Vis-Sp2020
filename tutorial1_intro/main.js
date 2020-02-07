// load csv 
d3.csv("../data/cereal.csv").then(data => {
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
        .text("Different Cereals")
        

    thead
        .append("tr")
        .selectAll("th")
        .data(data.columns)
        .join("td")
        .text(function(column) {
            return column.charAt(0).toUpperCase() + column.substr(1);}); 
            // capitalize first letter of cols 
    
    /** Body **/
    // rows 
    const rows = table 
        .append("tbody")
        .selectAll("tr")
        .data(data)
        .join("tr")
       // .attr("class", d => d.protein == "protein" ? 'high' : null)
       .attr("class", d => { 
        let tag ; 
        // could also do d.timestamp if it's one word. if there are spaces need the " " 
        if (+d["Protein"] > 2) { 
            tag = "name"; 
        }
        // re
        //console.log(d);

        return tag; 

    })
        ;


    // cells 
    rows
        .selectAll("td")
        .data(d => Object.values(d))
        .join("td")
        .attr("class", d => d == "Basic 4" || d == "Froot Loops" ? 'good' : null )
        
        .text(function(d) { return d ;})
        ;

})