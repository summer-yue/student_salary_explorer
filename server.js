var express = require('express'); // ExperssJS Framework
var app = express(); // Invoke express to variable for use in application
var port = process.env.PORT || 8080; // Set default port or assign a port in enviornment
var morgan = require('morgan'); // Import Morgan Package
var mongoose = require('mongoose'); // HTTP request logger middleware for Node.js
var bodyParser = require('body-parser'); // Node.js body parsing middleware. Parses incoming request bodies in a middleware before your handlers, available under req.body.
var path = require('path'); // Import path module

app.use(morgan('dev')); // Morgan Middleware
app.use(bodyParser.json()); // Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public')); // Allow front end to access public folder

// <---------- MONGOOSE CONFIGURATION ---------->

mongoose.connect('mongodb://summer:cis550@ds119302.mlab.com:19302/cis450mongo');
var db = mongoose.connection;

db.once('open', function () {
    console.log('Successfully connected to MongoDB');

    var college_score_card = db.collection('college_score_card');

    //API that looks up a college's information by college name
    //Currently returns just the first college
    //TODO: Joy
    app.get('/api/college_info/:college', function (req, res) {
        college_name = req.params.college;
        if (college_name === null) {
            res.json({ success: false, message: 'Ensure the college you want to look up is selected' });
        } else {
            college_score_card.findOne({"_id": 1}, function(err, result) {
                if (err) {
                    res.json({ success: false, message: 'Cannot find this school from the database.' });
                }
                res.json({ success: true, data: result});
            });
        }
    })

    //Params: 2 numbers indicating the range of salaries we are looking at
    //Return the colleges in a json list, indicating the colleges
    //whose median salary falls into range salary_range_low to salary_range_high, order doesn't matter
    app.get('/api/colleges_based_on_salary_range/:salary_range_low/:salary_range_high', function (req, res) {
        salary_range_low = Math.min(req.params.salary_range_low, req.params.salary_range_high);
        salary_range_high = Math.max(req.params.salary_range_low, req.params.salary_range_high);
        //TODO: connect API to SQL by Lawrence
        res.json({ success: true, data: {college: "Fake college", number_of_people: 1000}});
    })

    //Params: 2 numbers indicating the range of salaries we are looking at
    //Return the majors in a json list, indicating the majors
    //whose median salary falls into range salary_range_low to salary_range_high, order doesn't matter
    app.get('/api/majors_based_on_salary_range/:salary_range_low/:salary_range_high', function (req, res) {
        salary_range_low = Math.min(req.params.salary_range_low, req.params.salary_range_high);
        salary_range_high = Math.max(req.params.salary_range_low, req.params.salary_range_high);
        //TODO: connect API to SQL by Lawrence
        res.json({ success: true, data: {major: "Fake major", number_of_people: 100}});
    })
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html')); // Set index.html as layout
});

// Start Server
app.listen(port, function() {
    console.log('Running the server on port ' + port); // Listen on configured port
});
