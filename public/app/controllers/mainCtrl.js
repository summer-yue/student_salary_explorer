angular.module('mainController', []) /*injecting services used*/

// Controller: mainCtrl is used to handle login and main index functions (stuff that should run on every page)  
.controller('mainCtrl', function($scope) {
    var app = this;
    app.loadme = false; // Hide main HTML until data is obtained in AngularJS
    if ($window.location.pathname === '/') app.home = true;
});
