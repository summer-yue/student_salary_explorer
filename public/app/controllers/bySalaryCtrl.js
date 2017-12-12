angular.module('bySalaryController', []) /*injecting services used*/

// Controller: bySalaryCtrl is used to handle features related to searching by salary range
// This controller gets data from SQL databases and display things at /by_salary
.controller('bySalaryCtrl', function($scope, $http) {
    var app = this;
    app.loadme = false; // Hide main HTML until data is obtained in AngularJS
    $scope.colleges_in_range = "Please select range and click search";
    $scope.majors_in_range = "Please select range and click search";
    //console.log("Entering by salary controller api");
    
    $scope.display_college_major_in_range = function() {
        $http.get('/api/colleges_based_on_salary_range/1/20').success(function(result){
            $scope.colleges_in_range = result.data;
        });

        $http.get('/api/majors_based_on_salary_range/1/20').success(function(result){
            $scope.majors_in_range = result.data;
        });

        console.log("Salary ranging from " + $scope.salary_range_low + " to " + $scope.salary_range_high);
    }
});
