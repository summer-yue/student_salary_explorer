angular.module('byMajorController', []) /*injecting services used*/

// Controller: byMajorCtrl is used to handle features related to displaying information on selected majors
// This controller gets data from SQL databases and display things at /by_major
.controller('byMajorCtrl', function($scope, $http, utilService) {
    $scope.salary_data = [10, 20, 30, 40, 60, 80, 20, 50]
    var app = this;
    app.loadme = false; // Hide main HTML until data is obtained in AngularJS
    $scope.major_salary_results = [];
    $scope.major_gender_distribution = []; //{men, women, others}
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
        $scope.major_gender_distribution = []; //{men, women, others}
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
                    "total": result.data[0]["total"],
                    "men": result.data[0]["men"],
                    "women": result.data[0]["women"],
                    "others": result.data[0]["all"] - result.data[0]["women"] - result.data[0]["men"],
                })

                $scope.unemployment_rates.push({
                    "major_name": major,
                    "unemployment_rate": result.data[0]["unemployment_rate"]
                })
            })
        })

        display_all_charts = function(){
            display_salary_bar_chart();
            //display_gender_pie_chart();
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
