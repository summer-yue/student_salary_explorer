var app = angular.module('appRoutes', ['ngRoute'])

// Configure Routes; 'authenticated = true' means the user must be logged in to access the route
.config(function($routeProvider, $locationProvider) {

    // AngularJS Route Handler
    $routeProvider

    // Route: Home             
    .when('/', {
        templateUrl: 'app/views/pages/home.html', controller: 'mainCtrl'
    })

    .when('/by_college', {
        templateUrl: 'app/views/pages/by_college.html', controller: 'byCollegeCtrl'
    })

    .when('/by_salary', {
        templateUrl: 'app/views/pages/by_salary.html', controller: 'bySalaryCtrl'
    })

    .otherwise({ redirectTo: '/' }); // If user tries to access any other route, redirect to home page
});

