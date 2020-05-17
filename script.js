const projectName = 'bar-chart';
localStorage.setItem('example_project', 'D3: Bar Chart');

// URL to data for GDP.
var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var width = 800;
var height = 400;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Get json data using D3 fetch method.
d3.json(url)
  // Promise as function of data...
  .then(function(data) {

       // Body section tag.
       var section = d3.select("body")
	            .append("section");

      // Append header to the body section with
      // an h1 tag.
      var heading = section.append("header");
      heading.append("h1")
             .attr('id', 'title')
             .text("USA GDP Since 1947");

      // Extract an array of dates and an array of gdp data from
      // the data.
      let dates = data["data"].map(nestedArr => nestedArr[0]);
      let gdpData = data["data"].map(nestedArr => nestedArr[1]);

      // Create d3 linear scale object from gdp data.
      let linearScale = d3.scaleLinear()
                        .domain( [ 0, d3.max(gdpData) ] )
                        .range( [ 0, height ] );

      // Create array of scaled GDP using the d3 linear scale.
      let gdpScaled = gdpData.map( gdpVal => linearScale(gdpVal) );
      console.log(d3.max(gdpScaled)); // height


      



      
      
  })
  // Log error if promise on loading data not fulfilled.
  .catch(function(error) {
      console.log("Data did not load.");
  });

