//Notes:
/***************************************************************/
//How to judge the activity of any given day?
//the amount of changes in available bikes - relate that to temperature?
//Mapping fluctuation

//Reqs:
/***************************************************************/

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const express = require('express');
const fs = require('fs');
const GeoJSON = require('geojson');

//Server Stuff:
/******************************************************************/

const snapshotsSource = 'snapshots/gsons/';

const port = 3000;

app.use('/', express.static(path.join(__dirname, '/')));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

var dateRange = fetchDateRangeArray();

io.on('connection', function(socket) {
	console.log('A user connected');
	socket.emit('dateRange', dateRange);
	
	socket.on('fetchDay', function(data, callback) {
		var day = getGeoJson(data);
		callback(day);
	})

	socket.on('disconnect', function () {
  		console.log('A user disconnected');
  	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

//Handling data:
/***************************************************************/


function fetchDateRangeArray() {
	var dateRanges = [];
	fs.readdirSync(snapshotsSource).forEach(file => {
		dateRanges.push(file);
	});
	return (dateRanges);
}

// function getPositions(dir) {
// 	var data = [];
// 	var timestamps = [];
// 	var j = 0;
// 	fs.readdirSync(dir).forEach(file => {
// 		var snapshot = JSON.parse(fs.readFileSync(dir + file), 'utf8');
// 		if (file != '.' && file != '..')
// 			timestamps.push(file);
// 		for (var i = 0; i < snapshot.length; i++) {
// 			var obj = snapshot[i];
// 			var ob = {
// 				lat : obj.position.lat,
// 				lng : obj.position.lng,
// 				ratio : obj.available_bikes / obj.bike_stands,
// 				timestamp : file };
// 			data.push(ob);
// 		}
//   	});
//   	timestamps.sort();
// 	return ({
// 				points : data,
// 				timestamps : timestamps
// 			});
// }

function getGeoJson(day) {
	
	var ret = JSON.parse(fs.readFileSync(snapshotsSource + day), 'utf8');
	ret.points = GeoJSON.parse(ret.points, {Point: ['lat', 'lng'],  include: ['timestamp', 'ratio']});
	ret.points = {"id": day,
				"type": "circle",
        		"source": {
            		"type": "geojson",
            		"data": ret.points
            	},
            	'paint': {
					'circle-radius': {
						'base': 3.5,
						'stops': [[18, 5], [80, 90]]
					},
					'circle-color': {
						property: 'ratio',
						type: 'exponential',
						stops: [
		                    [0.0, 'orange'],
		                    [0.5, 'yellow'],
		                    [1.0, 'blue']
		        		]
					}
				}
			};
    // console.log(JSON.stringify(ob, null, 2));
	return (ret);
}

