angular.module('bySalaryController', []) /*injecting services used*/

// Controller: bySalaryCtrl is used to handle features related to searching by salary range
// This controller gets data from SQL databases and display things at /by_salary
.controller('bySalaryCtrl', function($scope, $http) {
    var app = this;
    app.loadme = false; // Hide main HTML until data is obtained in AngularJS

    //console.log("Entering by salary controller api");
    
    // $http.get('/api/college_info/temp').success(function(result){
    //     $scope.current_college_info = result.data;
    //     // console.log(result);
    // });
});
