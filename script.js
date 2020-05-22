const projectName = 'bar-chart';
localStorage.setItem('example_project', 'D3: Bar Chart');

// URL to data for GDP.
var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var width = 800;
var height = 400;

// Add an h1 title.
var section = d3.select(".header-info")
	        .append("h1")
	        .attr("id","title")
	        .text("USA GDP Since 1947");


// Tooltip for mouseover inside json function.
var tooltip = d3.select("body") // Doesn't work if you select d3-div
    .append("div")
    .attr("id","tooltip")
    .style("display","none"); // will set display of tooltip for each rect

// Declare svg d3 object.
var svgStuff = d3.select(".d3-div")
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
	svgStuff.append('text')
	.attr('transform', 'rotate(-90)')
	.attr('x', -300)
	.attr('y', 10)
	.text('Gross Domestic Product');
	
	// Add future x-label.
	svgStuff.append('text')
	.attr('x', width / 2 )
	.attr('y', height + 50)
        .text('Time (years)')
        .attr('class', 'info');

	
      // Extract an array of dates and an array of gdp data from
      // the data.
      let dates = data["data"].map(nestedArr => nestedArr[0]);
      let gdpData = data["data"].map(nestedArr => nestedArr[1]);

      // Get bar width for bar plot based on number of data points and width of svg.
      let barWidth = width/dates.length;

	
      // Extract the quarters and years from the data for use later with the tooltip.
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
	let xAxis = d3.axisBottom(timeScale); 

      // Plot x-axis.
      let xAxisPlot = svgStuff.append("g")
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

      // Place y-axis on left.	
      let yAxis = d3.axisLeft(yAxisScale);

      // Plot y-axis.	
      let yAxisPlot = svgStuff.append("g")
          .call(yAxis)
          .attr("id", "y-axis")
          .attr("transform", "translate(60, 0)");

        // Add the scalable vector graphic element for creating the bar plot.
	d3.select("svg")       
	    .selectAll("rect") 
	    .data(gdpScaled)  // add scaled gdp data
	    .enter()          
	    .append("rect")
	    .attr("class", "bar") // pass the class bar test
	    .attr("x", (d, i) => i*barWidth ) // map i-th data point to time scale on x-axis. 
	    .attr("width", barWidth)          // add width of each bar for line above.
	    .attr("y", (d, i) => height - d) // map i-th data point on y-axis to height minus data since inverted.
	    .attr("height", (d) => d)        // height of each bar
            .attr("data-date", (d, i) => dates[i] )
	    .attr("data-gdp", (d, i) => gdpData[i] ) 
	    .attr("transform", "translate(60, 0)") // Move the bars to the right to lign up with x-axis.
	// Delight the money trolls with this mousover/mouseout
       	// that uses the tooltip.
	.on("mouseover", (d, i) => {
	    tooltip.attr('data-date', dates[i])
		.style('display', 'inline-block')
                .style("left", d3.event.pageX - 120 + "px") // Position x coordinate of tooltip relative to current bar
	        .style("top", d3.event.pageY - 120 + "px") // Position y coordinate of tooltip relative to current bar
	        .style('transform', 'translateX(60px)')
	               .html(yearAndQuarter[i] + '<br>' + '$' + gdpData[i] + ' Billion USD' );
	})
	.on("mouseout", (d) => {
	    tooltip.style("display","none");
	});

      
  })
  // Log error if promise on loading data not fulfilled.
  .catch(function(error) {
      console.log(error);
  });
