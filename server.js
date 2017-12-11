var express = require('express'); // ExperssJS Framework
var app = express(); // Invoke express to variable for use in application
var port = process.env.PORT || 8080; // Set default port or assign a port in enviornment
var morgan = require('morgan'); // Import Morgan Package
var mongoose = require('mongoose'); // HTTP request logger middleware for Node.js
var bodyParser = require('body-parser'); // Node.js body parsing middleware. Parses incoming request bodies in a middleware before your handlers, available under req.body.
// var router = express.Router(); // Invoke the Express Router
//var appRoutes = require('./app/routes/api')(router); // Import the application end points/API
var path = require('path'); // Import path module

app.use(morgan('dev')); // Morgan Middleware
app.use(bodyParser.json()); // Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public')); // Allow front end to access public folder
//app.use('/api', appRoutes); // Assign name to end points (e.g., '/api/management/', '/api/users' ,etc. )

//var routes = require('./app/routes/api.js');
//var College = require('./app/models/college.js');

// 
// <---------- REPLACE WITH YOUR MONGOOSE CONFIGURATION ---------->
// 
mongoose.connect('mongodb://summer:cis550@ds119302.mlab.com:19302/cis450mongo');
var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    console.log('Successfully connected to MongoDB');

    //app.get('/api/college_info/:college', routes.lookup_college_info());
    var CollegeSchema = mongoose.Schema({
        "_id": { type: String, required: true},
        "avg_net_price_private": { type: String },
        "out_of_state_tuition": { type: String },
        "in_state_tuition": { type: String },
        "avg_net_price_public": { type: String },
        "school_name": { type: String },
        "admissions_rate": { type: String },
        "state": { type: String },
        "city": { type: String },
        "student_number": { type: String },
        "school_url": { type: String },
    });

    var College = mongoose.model('college_score_card', CollegeSchema);
    var college_score_card = db.collection('college_score_card');
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

// TBD: index should always be the beginning layout?
// Can't go directly to by_college, do we want that?
// app.get('/by_college', function(req, res) {
//     res.sendFile(path.join(__dirname + '/public/app/views/pages/by_college.html')); // Set by_college.html as layout
// });

// Start Server
app.listen(port, function() {
    console.log('Running the server on port ' + port); // Listen on configured port
});
