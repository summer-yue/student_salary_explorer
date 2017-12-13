angular.module('byCollegeController', []) /*injecting services used*/

// Controller: byCollegeCtrl is used to handle features related to searching by college
// This controller gets data from MongoDB's College Scoreboard API and display things at /by_college
.controller('byCollegeCtrl', function($scope, $http) {
    var app = this;
    app.loadme = false; // Hide main HTML until data is obtained in AngularJS


	$scope.current_college_info = {};
    $scope.display_college_info = function() {
        $http.get('/api/college_info/' + $scope.college_name).success(function(result){
            $scope.current_college_info = result.data;
        });

        // console.log("College name: " + $scope.college_name);
        // console.log("College name: " + $scope.current_college_info.avg_net_price_private);
    }
 });
