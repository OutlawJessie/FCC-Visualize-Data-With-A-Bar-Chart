const projectName = 'bar-chart';
localStorage.setItem('example_project', 'D3: Bar Chart');

// URL to data for GDP.
var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var width = 800;
var height = 400;

// Declare svg d3 object.
var svg = d3.select(".d3-div")
            .append("svg")
            .attr("width", width*1.15)
    .attr("height", height*1.15);



// Month to quarter lookup object for converting months
// into respective economic quarter.
var month2QuarterMap = new Map();
month2QuarterMap.set("01", "Q1");
month2QuarterMap.set("04", "Q2");
month2QuarterMap.set("07", "Q3");
month2QuarterMap.set("10", "Q4");


// Get json data using D3 fetch method.
d3.json(url)
  // Promise as function of data...
    .then(function(data) {

	// Add future y-label
	svg.append('text')
	.attr('transform', 'rotate(-90)')
	.attr('x', -300)
	.attr('y', 80)
	.text('Gross Domestic Product');
	
	// Add future x-label.
	svg.append('text')
	.attr('x', width / 2 + 90)
	.attr('y', height + 50)
        .text('Time (years)')
        .attr('class', 'info');

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

      // Extract the quarters and years from the data.
      let yearAndQuarter = data["data"].map( (dateStr)=>{
	  let dateArr = dateStr[0].split('-');
	  return dateArr[0] + " " + month2QuarterMap.get(dateArr[1]);
      });
      
      // Get Unix epoch style dates too.
      let unixDates = data["data"].map( item => new Date(item[0]) );

      // Build time scale by first finding maxima point.
      // Get last date in set. (june 2015)
      let xMax = new Date(d3.max(unixDates)); 
      // add 3 months to that last date. (sept 2015). this maybe creates a cushion?
      xMax.setMonth(xMax.getMonth() + 3);
      let timeScale = d3.scaleTime()
	             .domain([d3.min(unixDates), xMax])
                     .range([0, width]);

      // Use time scale to create x-axis, with x-axis placed on bottom.
      let xAxis = d3.axisBottom()
                    .scale(timeScale);
      


      // Plot x-axis.
      let xAxisPlot = svg.append("g")
          .call(xAxis)
          .attr("id", "x-axis")
          .attr("transform", "translate(60, 400)");


      
      // Create d3 linear scale object from gdp data.
      let linearScale = d3.scaleLinear()
                        .domain( [ 0, d3.max(gdpData) ] )
          .range( [ 0, height ] );


      // Create array of scaled GDP using the d3 linear scale.
      let gdpScaled = gdpData.map( gdpVal => linearScale(gdpVal) );

      // set domain and range for y-axis.
      let yAxisScale = d3.scaleLinear()
          .domain([0, d3.max(gdpData)])
          .range([height, 0]);

      let yAxis = d3.axisLeft(yAxisScale);

      let yAxisPlot = svg.append("g")
          .call(yAxis)
          .attr("id", "y-axis")
          .attr("transform", "translate(60, 0)");
      


      
      
  })
  // Log error if promise on loading data not fulfilled.
  .catch(function(error) {
      console.log(error);
  });

