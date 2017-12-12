angular.module('byMajorController', []) /*injecting services used*/

// Controller: byMajorCtrl is used to handle features related to displaying information on selected majors
// This controller gets data from SQL databases and display things at /by_major
.controller('byMajorCtrl', function($scope, $http, utilService) {
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
    }
});
