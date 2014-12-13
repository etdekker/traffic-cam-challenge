// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$( document ).ready(function() {
	var mapOptions = {
		center: { lat: 47.6, lng: -122.3},
		zoom: 12
	};
	var map = new google.maps.Map(document.getElementById('map'), mapOptions);

	var infoWin = new google.maps.InfoWindow();

	var marker = new google.maps.Marker({
		position: { lat: 47.6, lng: -122.3},
		map: map
	});
	var markers = [];
	$.getJSON("http://data.seattle.gov/resource/65fc-btcc.json")
		.done(function(data) {
			$.each(data, function(key, val) {
				var lat =  parseFloat(val.location.latitude);
				var lng = parseFloat(val.location.longitude);
				var marker = new google.maps.Marker({
					position: { lat: lat, lng: lng},
					map: map,
					title: val.cameralabel
				});
				markers.push(marker);
				google.maps.event.addListener(marker, 'click', function() {
					map.panTo(this.getPosition());
					infoWin.setContent('<p>' 
						+ val.cameralabel
						+ '</p>'
						+ '<img src="' 
						+ val.imageurl.url
						+'">');
					infoWin.open(map, marker);
				});
			});
		})
		.fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			alert( "Request Failed: " + err );
	});
	$('search').bind('search keyup', function() {
		var search = $('search').toLowerCase();
		$.each(markers, function(key, val) {
			var label = val.title.toLowerCase();
			if(!label.indexOf(search)){
				this.setMap(null);
			} else {
				this.setMap(map);
			}
		});
		
	});
});

