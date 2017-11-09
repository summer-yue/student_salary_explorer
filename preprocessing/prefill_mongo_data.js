/*
 * A node script taking data from the college scorecard API and save the relavant information into MongoDb
 */

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var mongodb = require('mongodb');

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


var uri = 'mongodb://summer:cis550@ds119302.mlab.com:19302/cis450mongo';
var page = 1
flag = true

var counter = 0
mongodb.MongoClient.connect(uri, function(err, db) {
    if(err) throw err;
    var college_score_card = db.collection('college_score_card');

    // There is 76 pages in total
    while (flag && page < 76){
        var queryUrl = "https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=BQ7FffD1wSmE5xNs7BIWjY1tEXr8jMfx36BrBk84&\
_per_page=100&_page=" + page + 
"&_fields=id,school.name,2015.cost.tuition.out_of_state,2015.cost.tuition.in_state,2015.cost.avg_net_price.public,2015.cost.avg_net_price.private,\
2015.admissions.admission_rate.overall,school.state,school.city,2015.student.size,school.school_url"

        json_data = httpGet(queryUrl)

        if (JSON.parse(json_data)["errors"] != undefined) {
            console.log("An error is returned when connecting with page:" + page.toString());
            flag = false;
        } else {
            results = JSON.parse(json_data)["results"];
            new_results = []
            // rename keys in the dictionary because . is invalid in mongo       
            results.forEach(function(dict){
                var new_dict = {};
                new_dict["_id"] = counter
                new_dict["avg_net_price_private"] = dict["2015.cost.avg_net_price.private"];
                new_dict["out_of_state_tuition"] = dict["2015.cost.tuition.out_of_state"];
                new_dict["in_state_tuition"] = dict["2015.cost.tuition.in_state"];
                new_dict["avg_net_price_public"] = dict["2015.cost.avg_net_price.public"];
                new_dict["school_name"] = dict["school.name"];
                new_dict["admissions_rate"] = dict["2015.admissions.admission_rate.overall"]
                new_dict["state"] = dict["school.state"]
                new_dict["city"] = dict["school.city"]
                new_dict["student_number"] = dict["2015.student.size"]
                new_dict["school_url"] = dict["school.school_url"]
                
                counter = counter + 1
                new_results.push(new_dict);
            });

            //Insert record from college score card API with tuition information
            college_score_card.insert(new_results, function(err, result) {
                if (err) throw err;
            });

            page = page + 1;
            console.log("on page:" + page.toString());
        }
    }
})
