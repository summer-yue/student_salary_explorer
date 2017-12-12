angular.module('byMajorController', []) /*injecting services used*/

// Controller: byMajorCtrl is used to handle features related to displaying information on selected majors
// This controller gets data from SQL databases and display things at /by_major
.controller('byMajorCtrl', function($scope, $http, utilService) {
    $scope.salary_data = [10, 20, 30, 40, 60, 80, 20, 50]
    var app = this;
    app.loadme = false; // Hide main HTML until data is obtained in AngularJS
    $scope.major_salary_results = [];
    $scope.major_gender_distribution = []; //{men, women}
    $scope.unemployment_rates = []; //{employed, unemployed}

    //console.log("Entering by major controller api");
   
    //Find all majors to fill in for user to select
    $http.get('/api/majors_based_on_salary_range/0/1000000').success(function(result){
        $scope.all_majors = [];
        Object.keys(result.data).forEach(function(key) {
            major = result.data[key]["major_name"];
            major = utilService.capitalizeFirstLetter(major);
            $scope.all_majors.push(major);
        });
    });

    //The function binds to the "Explore" button. 
    //It queries the SQL APIs and display all the relavant graphs.
    $scope.display_graph_on_majors = function() {
        $scope.major_salary_results = [];
        $scope.major_gender_distribution = []; //{men, women}
        $scope.unemployment_rates = []; //{employed, unemployed}

        //Fill in the dictionary list for [{major, starting_salary, mid_career_salary} ...] for selected majors
        $scope.selected_majors.forEach(function(major) {
            $http.get('/api/major_salary_info/' + major).success(function(result){
                $scope.major_salary_results.push({
                    "major_name": major,
                    "median_salary": result.data[0]["median_salary"]
                })
            })

            $http.get('/api/major_gender_employment_info/' + major).success(function(result){
                $scope.major_gender_distribution.push({
                    "major_name": major,
                    "men": result.data[0]["men"],
                    "women": result.data[0]["women"],
                })

                $scope.unemployment_rates.push({
                    "major_name": major,
                    "unemployment_rate": result.data[0]["unemployment_rate"]
                })
            })
        })

        display_all_charts = function(){
            display_salary_bar_chart();

            $scope.major_gender_distribution.forEach(function(major_gender) {
                gender_data = [
                    {"label":"Men: " + major_gender["men"], "value": major_gender["men"]}, 
                    {"label":"Women :" + major_gender["women"], "value": major_gender["women"]}
                ];
                display_gender_pie_charts(gender_data, major_gender.major_name);               
            })
           
            display_employment_bar_chart();
        }

        setTimeout(display_all_charts, 1000); //Allowing time to load data
        //TODO: make this a callback
    }

    display_salary_bar_chart = function() {
        var margin = {top:100, right:100, bottom:100, left:100};

        var width = 960 - margin.left - margin.right;

        var height = 500 - margin.top - margin.bottom;

        var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .5)

        var yScale = d3.scale.linear()
              .range([height, 0]);

        var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");
              
        var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");

        var svgContainer = d3.select("#salary-bar-chart").append("svg")
                .attr("width", width+margin.left + margin.right)
                .attr("height",height+margin.top + margin.bottom)
                .append("g").attr("class", "container")
                .attr("transform", "translate("+ margin.left +","+ margin.top +")");

        xScale.domain($scope.major_salary_results.map(function(d) { return utilService.firstWord(d.major_name); }));
        yScale.domain([d3.min($scope.major_salary_results, function(d) { return d.median_salary; }) - 5000,
            d3.max($scope.major_salary_results, function(d) { return d.median_salary; }) + 5000]);

        //xAxis. To put on the top, swap "(height)" with "-5" in the translate() statement. Then you'll have to change the margins above and the x,y attributes in the svgContainer.select('.x.axis') statement inside resize() below.
        var xAxis_g = svgContainer.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height) + ")")
                .call(xAxis)
                .selectAll("text");
                    
        // Uncomment this block if you want the y axis
        var yAxis_g = svgContainer.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6).attr("dy", ".71em")
                //.style("text-anchor", "end").text("Number of Applicatons"); 

        svgContainer.selectAll(".bar")
            .data($scope.major_salary_results)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(utilService.firstWord(d.major_name)); })
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) { return yScale(d.median_salary); })
            .attr("height", function(d) { return height - yScale(d.median_salary); });
    }

    display_gender_pie_charts = function(data, major) {
        var w = 300,                        //width
        h = 300,                            //height
        r = 100,                            //radius
        color = d3.scale.category20c();     //builtin range of colors
        
        var vis = d3.select("#gender-pie-chart")
            .append("svg:svg")              //create the SVG element inside the <gender-pie-chart>
            .data([data])                   //associate our data with the document
                .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                .attr("height", h)
            .append("svg:g")                //make a group to hold our pie chart
                .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

        var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
            .outerRadius(r);

        var pie = d3.layout.pie()           //this will create arc data for us given a list of values
            .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

        var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
            .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
            .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                    .attr("class", "slice");    //allow us to style things in the slices (like text)

            arcs.append("svg:path")
                    .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                    .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

            arcs.append("svg:text")                                     //add a label to each slice
                    .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                    //we have to make sure to set these before calling arc.centroid
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
                })
                .attr("text-anchor", "middle")                          //center the text on it's origin
                .text(function(d, i) { return data[i].label; }); 

            vis.append("text")
                .text(utilService.firstWord(major))
    }

    display_employment_bar_chart = function() {
        var margin = {top:100, right:100, bottom:100, left:100};

        var width = 960 - margin.left - margin.right;

        var height = 500 - margin.top - margin.bottom;

        var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .5)

        var yScale = d3.scale.linear()
              .range([height, 0]);

        var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");
              
        var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");

        var svgContainer = d3.select("#employment-bar-chart").append("svg")
                .attr("width", width+margin.left + margin.right)
                .attr("height",height+margin.top + margin.bottom)
                .append("g").attr("class", "container")
                .attr("transform", "translate("+ margin.left +","+ margin.top +")");

        xScale.domain($scope.unemployment_rates.map(function(d) { return utilService.firstWord(d.major_name); }));
        yScale.domain([d3.min($scope.unemployment_rates, function(d) { return d.unemployment_rate; }) - 0.01,
            d3.max($scope.unemployment_rates, function(d) { return d.unemployment_rate; }) + 0.01]);

        //xAxis. To put on the top, swap "(height)" with "-5" in the translate() statement. Then you'll have to change the margins above and the x,y attributes in the svgContainer.select('.x.axis') statement inside resize() below.
        var xAxis_g = svgContainer.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height) + ")")
                .call(xAxis)
                .selectAll("text");
                    
        // Uncomment this block if you want the y axis
        var yAxis_g = svgContainer.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6).attr("dy", ".71em")
                //.style("text-anchor", "end").text("Number of Applicatons"); 

        svgContainer.selectAll(".bar")
            .data($scope.unemployment_rates)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(utilService.firstWord(d.major_name)); })
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) { return yScale(d.unemployment_rate); })
            .attr("height", function(d) { return height - yScale(d.unemployment_rate); });
    }
});
