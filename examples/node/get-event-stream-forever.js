/*jslint node: true */
"use strict";

var spark = require('../../lib/spark');
//var spark = require('spark');

//example code to re open the SSE stream when it ends
 var openStream = function() {

    //Get your event stream
    var req = spark.getEventStream(false, 'mine', function(data) {
      console.log("Event: " + JSON.stringify(data));
    });

    req.on('end', function() {
        console.log("ended!  re-opening in 3 seconds...");
        setTimeout(openStream, 3 * 1000);
    });
};

spark.on('login', function() {
    openStream();
});
