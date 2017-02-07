/*************************************************************
 * My Treehouse Projects
 *
 * FSJS proj #7 
 * 
 * Twitter Interface
 *
 * Robert Manolis, Milwaukie OR, February - 2017  :)
 *************************************************************/
(function() {
	"use strict";

	var express = require("express");
	var Twit = require("twit");
	var config = require("./config.js");
	
	var T = new Twit(config);

	var app = express();

	app.use('/static', express.static(__dirname + '/public'));

	app.set('view engine', 'pug');
	app.set('views', __dirname + '/templates');

	var friends = {};
	var timeline = {};
	var direct_messages = {};
	var sent_messages = {};
	
	// HELPER FUNCTION FOR GETTING TWITTER DATA AND PASSING IT TO A CALLBACK FOR LATER USE
	function getData(callback) {
		
		// FOLLOWING
		T.get('friends/list', function(err, data, response) {
			if(err) {
				throw error;
			} else {
				friends = data.users;
			}
		});
		
		// TWEETS
		T.get('statuses/user_timeline', function(err, data, response) {
			if(err) {
				throw error;
			} else {
				timeline = data;
			}
		});
		
		// DIRECT MESAGES I'VE SENT
		T.get('direct_messages', function(err, data, response) {
			if(err) {
				throw error;
			} else {
				direct_messages = data;
			}
		});
		
		// DIRECT MESAGES I'VE RECEIVED
		T.get('direct_messages/sent', function(err, data, response) {
			if(err) {
				throw error;
			} else {
				sent_messages = data;
			} 
		});
		
		callback();
	}

	// RENDER DATA AND HANDLE ROUTES
	getData(function() {
		app.get('/', function(req, res) {
			var path = req.path;	
			res.render('index', {friends: friends, timeline: timeline, direct_messages: direct_messages, sent_messages: sent_messages});
		});
		
		// IF BROWSER IS POINTED AT ANYTHING BUT THE HOME ROUTE 
		// REDIRECT TO NICE ERROR PAGE
		app.get('/:param?', function(req, res) {
			var param = req.params.param;	
			
			if (param) {
				res.render("error", {timeline: timeline, isWrongPath: true});
			}
		});
	});

	app.listen(3000, function() {
		console.log("The frontend server is running on port 3000!");
	});
})();