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
	var sorted_messages = {};
	
	// HELPER FUNCTION FOR GETTING TWITTER DATA WITH A CALLBACK
	function getData(callback) {
		
		// FOLLOWING
		T.get('friends/list', function(err, data, response) {
			if(err) {
				throw err;
			} else {
				friends = data.users;
			}
		});
		
		// TWEETS
		T.get('statuses/user_timeline', function(err, data, response) {
			if(err) {
				throw err;
			} else {
				timeline = data;
			}
		});
		
		// DIRECT MESAGES I'VE SENT
		T.get('direct_messages', function(err, data, response) {
			if(err) {
				throw err;
			} else {
				direct_messages = data;
			}
		});
		
		// DIRECT MESAGES I'VE RECEIVED
		T.get('direct_messages/sent', function(err, data, response) {
			if(err) {
				throw err;
			} else {
				sent_messages = data;
			} 
		});
		
		callback();
	}
	

	// IF BROWSER IS POINTED AT ANYTHING BUT THE HOME ROUTE 
	// REDIRECT TO NICE ERROR PAGE
	// ELSE RENDER DATA
	getData(function() {
		app.get('/*', function(req, res) {
			var path = req.path;	
			if (path !== "/") {
				
				// RENDER ERROR PAGE
				res.render("error", {timeline: timeline, isWrongPath: true});
			} else {
				// COMBINE SENT AND RECEIVED DIRECT MESSAGES
				combineMessages(direct_messages, sent_messages, function() {
					
					// SORT MESSAGES CHRONOLIGICALLY
					sortMessages(newArry, function() {
						
						// RENDER DATA
						res.render('index', {friends: friends, timeline: timeline, direct_messages: direct_messages, sent_messages: sent_messages, sorted_messages: sorted_messages});
					});
				});
			}
		});
	});
	
	// START SERVER
	app.listen(3000, function() {
		console.log("The frontend server is running on port 3000!");
	});
	
	
	// HELPER CALLBACK FUNCTIONS FOR COMBINING SENT AND RECEIVED DIRECT MESSAGES
	// AND SORTING THEM CHRONOLIGICALLY
	var newArry;
	var sortedArry;
	function combineMessages(arry1, arry2, callback) {
		newArry = arry1.concat(arry2);
		callback();
	}
	function sortMessages(arry, callback) {
		sorted_messages = arry.sort(function(a, b) {
			return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
		});
		callback();
	}
})();