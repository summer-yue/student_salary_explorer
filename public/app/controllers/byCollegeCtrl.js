angular.module('ByCollegeController', []) /*injecting services used*/

// Controller: byCollegeCtrl is used to handle features related to searching by college
// This controller gets data from MongoDB's College Scoreboard API and display things at /by_college
.controller('byCollegeCtrl', function($scope) {
    var app = this;
    app.loadme = false; // Hide main HTML until data is obtained in AngularJS
});
