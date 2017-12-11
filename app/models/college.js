var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin
var validate = require('mongoose-validator'); // Import Mongoose Validator Plugin

// College Mongoose Schema
var CollegeSchema = mongoose.Schema({
    "_id": { type: String, required: true},
    "avg_net_price_private": { type: String },
    "out_of_state_tuition": { type: String },
    "in_state_tuition": { type: String },
    // avg_net_price_public: { type: String },
    // school_name: { type: String },
    // admissions_rate: { type: String },
    // state: { type: String },
    // city: { type: String },
    // student_number: { type: String },
    // school_url: { type: String },
});

module.exports = mongoose.model('college_score_card', CollegeSchema); // Export College Model for us in API
