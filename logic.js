//Create the function to determine marker size base on eartkquake magnitude.
function markerSize(magnitude) {
	return feature.properties.mag * 10;
}


// Store the API endpoint inside the queryURL.

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL.
d3.json(queryURL, function(data){
  //CreateFeatures object for the Create features function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
	function onEachFeature(feature, layer) {
		layer.bindPopup("<h2>" + feature.properties.place + 
		"<h3><hr><p>" + new Date(feature.properties.time) + "<p>" );
	}

	var earthquakes = L.geoJSON(earthquakeData, {
		onEachFeature: onEachFeature
	});

	//Sending the earthquakes layer to the createMap function.
	createMap(earthquakes);
}

var magnitudeMarkers = []
//Loop through the earthquake data and creat markers based on earthquake magnitude.
for (var i = 0; data.length; i++) {
	magnitudeMarkers.push(
		L.circle(data[i].features.properties.coordinates, {
			stroke:false,
			fillOpacity: 0.75,
			color:"blue",
			fillColor:"blue",
			radius: markerSize(earthquakeData[i].features.properties.mag)
	})
  );
}

function createMap(earthquakes) {
	//Define outdoor and satellite map layers.
	var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
		"access_token=pk.eyJ1IjoibXVzaWNhbGVib255IiwiYSI6ImNqY3NiNXZsYzAyN2Myd251NHgxM3hndTYifQ.6XB6Sol3LwVrKQy5GqGS4Q");
    
    var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10.html/tiles/256/{z}/{x}/{y}?" +
    	"access_token=pk.eyJ1IjoibXVzaWNhbGVib255IiwiYSI6ImNqY3NiNXZsYzAyN2Myd251NHgxM3hndTYifQ.6XB6Sol3LwVrKQy5GqGS4Q");

    //Define a baseMaps object to hold the baselayers.
    var baseMaps = {
    	"Outdoor Map":outdoorMap,
    	"Satellite Map":satelliteMap
    };

    //Create an overlay object to hold the overlay layer.
    var overlayMaps = {
    	Earthquakes: earthquakes
    };

    //Create the map giving it the outdoormak and earthquake layers to display the map on load.
    var myMap = L.map("map",{
    	center: [37.09, -95.71],
    	zoom: 5,
    	layers:[outdoorMap, earthquakes]
    });

    //Create a layer control.
    //Pass in the baseMaps and overlayMaps
    //Add the control layer to the map.
    L.control.layers(baseMaps,overlayMaps,{
    	collapse: false
    }).addTo(myMap);
 }