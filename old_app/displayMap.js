var currData;
var map;
var zoomAtStart;
var dateRange;
var origCircleVal1;
var origCircleVal2;

function resetHourSlider(timestamp) {
	var date = new Date(timestamp * 1000);
	var minutes = date.getMinutes();
	if (minutes < 10)
		minutes = "0" + minutes;
	var s = date.getHours() + ":" + minutes;
	document.getElementById('active-hour').innerText = s;
}

function resetDateSlider(timestamp) {
	var date = new Date(timestamp * 1000);
	var s = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
	console.log(date);
	document.getElementById('slider-hour').value = 0;
	document.getElementById('active-date').innerText = s;
}

socket.on('dateRange', function(data) {

	var e = document.getElementsByClassName('proportions');
	origCircleVal1 = e[0].r.baseVal.value;
	origCircleVal2 = e[1].r.baseVal.value;
	
	dateRange = data;
	
		//Adjust date slider:
	document.getElementById('slider-date').max = dateRange.length - 2;
	resetDateSlider(dateRange[0]);

		//Fetch Map:
	mapboxgl.accessToken =
	'pk.eyJ1IjoiaXNhYWNsdW1wa2lucyIsImEiOiJjajNhdTVlZXMwMGFnMzJvNzdoemQ0N3phIn0.hv3Atoq7kaBU9F-YCBGBOw';
	map = new mapboxgl.Map({
		container: 'map',
		zoom: 11,
		center: [2.3522, 48.8566],
		style: 'mapbox://styles/isaaclumpkins/cj3j0p1be000g2ssatrsnvjp0'
	});

		//Get/set Initial data Initial Data
	socket.emit('fetchDay', dateRange[0], function (data) {
		currData = data;
		map.on('load', function () {
			map.addLayer(data.points);
			map.setFilter(dateRange[0], ['==', 'timestamp', data.timestamps[0]]);
			document.getElementById('slider-hour').max = data.timestamps.length - 1;
			resetHourSlider(data.timestamps[0]);
		
			//watch map events:
			map.on('zoomstart', function () {
				zoomAtStart = map.getZoom();
				// console.log("start : " + zoom);
			});

			map.on('zoomend', function () {
				var zoomAtEnd;
				zoomAtEnd = map.getZoom();
				console.log("end : " + zoomAtEnd);
				if (zoomAtStart < zoomAtEnd)
					zoomAtEnd *= -1;
				zoomAtEnd /= 100;
				var e = document.getElementsByClassName('proportions');
				e[0].r.baseVal.value = origCircleVal1 + origCircleVal1 * zoomAtEnd;
				e[1].r.baseVal.value = origCircleVal2 + origCircleVal2 * zoomAtEnd;
			});
		});
	});
});

//Handle user input:
document.getElementById('slider-date').addEventListener('input', function(e) {
	var dateIndex = parseInt(e.target.value);
	resetDateSlider(dateRange[dateIndex]);
});


document.getElementById('slider-date').addEventListener('change', function(e) {
	var prevDate = currData.points.id;
		console.log(prevDate);
	var dateIndex = parseInt(e.target.value);
	var dateValue = dateRange[dateIndex];
	socket.emit('fetchDay', dateValue, function (data) {
		currData = data;
		map.removeLayer(prevDate);
		map.removeSource(prevDate);
		map.addLayer(data.points);
		map.setFilter(data.points.id, ['==', 'timestamp', data.timestamps[0]]);
		document.getElementById('slider-hour').max = data.timestamps.length - 1;
		resetHourSlider(data.timestamps[0]);
	});
});

document.getElementById('slider-hour').addEventListener('input', function(e) {
	var hour = parseInt(e.target.value);
	resetHourSlider(currData.timestamps[hour]);
	map.setFilter(currData.points.id, ['==', 'timestamp', currData.timestamps[hour]]);
});

