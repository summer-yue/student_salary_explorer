var jwt = require('jsonwebtoken'); // Import JWT Package
var secret = 'harrypotter'; // Create custom secret for use in JWT

var College = require('../models/college');

module.exports = function(router) {

    // api used to connect to information from Mongo
    router.get('/api/college_info/:college', function(req, res) {
        college_name = req.params.college;
        if (college_name === null) {
            res.json({ success: false, message: 'Ensure the college you want to look up is selected' });
        } else {
            // College.findOne.({ school_name: college_name }) ...
            // TODO BY JOY
            res.json({ success: true, message: "TODO: connect to Mongo data and return in API" })
        }
    })

    return router; // Return the router object to server
};
