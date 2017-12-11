var app = angular.module('appRoutes', ['ngRoute'])

// Configure Routes; 'authenticated = true' means the user must be logged in to access the route
.config(function($routeProvider, $locationProvider) {

    // AngularJS Route Handler
    $routeProvider

    // Route: Home             
    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })

    .when('/by_college', {
        templateUrl: 'app/views/pages/by_college.html'
    })

    .otherwise({ redirectTo: '/' }); // If user tries to access any other route, redirect to home page
});

