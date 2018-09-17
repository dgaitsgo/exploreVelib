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

function getGeoJson(day) {

	var ret = JSON.parse(fs.readFileSync(snapshotsSource + day), 'utf8');
	ret.points = GeoJSON.parse(ret.points, {Point: ['lat', 'lng'],  include: ['timestamp', 'ratio', 'size']});
	ret.points = {"id": day,
				"type": "circle",
        		"source": {
            		"type": "geojson",
            		"data": ret.points
            	},
            	'paint': {
					'circle-radius': {
						property : 'size',
						'stops': [
							[0, 0],
							[200, 200]
						]
					},
					'circle-color': {
						property: 'ratio',
						type: 'exponential',
						stops: [
		                    [0.0, 'orange'],
		                    [0.5, 'yellow'],
		                    [1.0, 'blue']
		        		]
					},
					'circle-stroke-width' : 1,
				}
			};
	return (ret);
}
