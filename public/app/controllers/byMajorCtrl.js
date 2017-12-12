angular.module('byMajorController', []) /*injecting services used*/

// Controller: byMajorCtrl is used to handle features related to displaying information on selected majors
// This controller gets data from SQL databases and display things at /by_major
.controller('byMajorCtrl', function($scope, $http, utilService) {
    var app = this;
    app.loadme = false; // Hide main HTML until data is obtained in AngularJS
    $scope.major_salary_results = "Looking ..."

    //console.log("Entering by major controller api");
   
    //Find all majors to fill in for user to select
    $http.get('/api/majors_based_on_salary_range/0/1000000').success(function(result){
        $scope.all_majors = []
        Object.keys(result.data).forEach(function(key) {
            major = result.data[key]["major_name"];
            major = utilService.capitalizeFirstLetter(major);
            $scope.all_majors.push(major);
        });
    });

    //The function binds to the "Explore" button. 
    //It queries the SQL APIs and display all the relavant graphs.
    $scope.display_graph_on_majors = function() {
        //Fill in the dictionary list for [{major, starting_salary, median_salary} ...] for selected majors
    }
});
