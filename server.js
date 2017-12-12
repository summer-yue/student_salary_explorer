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

// <---------- SQL CONFIGURATION ---------->
var mysql = require('mysql');
var sql_con = mysql.createConnection({
  host: "joy450db.cxhh83fv1ksp.us-west-2.rds.amazonaws.com",
  user: "joy450team",
  password: "iamjoyspassword",
  database: "450schema"
});

sql_con.connect(function(err) {
    if (err) throw err;
    console.log('Successfully connected to MySQL');

    //Params: 2 numbers indicating the range of salaries we are looking at
    //Return the colleges in a json list, indicating the colleges
    //whose median salary falls into range salary_range_low to salary_range_high, order doesn't matter
    app.get('/api/colleges_based_on_salary_range/:salary_range_low/:salary_range_high', function (req, res) {
        salary_range_low = Math.min(req.params.salary_range_low, req.params.salary_range_high);
        salary_range_high = Math.max(req.params.salary_range_low, req.params.salary_range_high);
   
        query_find_colleges = "SELECT DISTINCT school_name, starting_median_salary\
            FROM salary_by_region\
            WHERE starting_median_salary >= " + salary_range_low + 
            " AND starting_median_salary <= " + salary_range_high +
            " ORDER BY starting_median_salary DESC;"

        sql_con.query(query_find_colleges, function (err, result, fields) {
            if (err)  {
                res.json({ success: false, error: err});
            }
            console.log(result);
            res.json({ success: true, data: result});
        });
    })

    //Params: 2 numbers indicating the range of salaries we are looking at
    //Return the majors in a json list, indicating the majors
    //whose median salary falls into range salary_range_low to salary_range_high, order doesn't matter
    app.get('/api/majors_based_on_salary_range/:salary_range_low/:salary_range_high', function (req, res) {
        salary_range_low = Math.min(req.params.salary_range_low, req.params.salary_range_high);
        salary_range_high = Math.max(req.params.salary_range_low, req.params.salary_range_high);

        query_find_majors = "SELECT DISTINCT major_name, median_salary\
            FROM major\
            WHERE median_salary >= " + salary_range_low + 
            " AND median_salary <= " + salary_range_high +
            " ORDER BY median_salary DESC;"

        sql_con.query(query_find_majors, function (err, result, fields) {
            if (err)  {
                res.json({ success: false, error: err});
            }
            console.log(result);
            res.json({ success: true, data: result});
        });
    })
});

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
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html')); // Set index.html as layout
});

// Start Server
app.listen(port, function() {
    console.log('Running the server on port ' + port); // Listen on configured port
});
