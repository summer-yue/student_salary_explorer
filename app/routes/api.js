//var jwt = require('jsonwebtoken'); // Import JWT Package
//var secret = 'harrypotter'; // Create custom secret for use in JWT

//var College = require('../models/college.js');

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

var lookup_college_info = function (req, res) {
     // api used to connect to information from Mongo
    college_name = req.params.college;
    if (college_name === null) {
        res.json({ success: false, message: 'Ensure the college you want to look up is selected' });
    } else {
        // College.findOne.({ school_name: college_name }) ...
        // TODO BY JOY
        console.log(College)
        College.find({}, function(err, college) {
            if (err) {
                res.json({ success: false, message: 'Cannot find this school from the database.' });
            } else {
                //res.json(college);
                res.json({ success: true, data: college});
            }
        });
    }
};

module.exports = {
    lookup_college_info: lookup_college_info,
};
