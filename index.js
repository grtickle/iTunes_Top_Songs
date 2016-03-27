
/**
	Returns a string with the iTunes data in table html format
**/
var appendValues = function(songArray) {
	songArray.each(function() {	
		var title = $(this).find("im\\:name").eq(0).text();
		var songImage = $(this).find("im\\:image").eq(0).text(); 
		var artist = $(this).find("im\\:artist").text();
		var album = $(this).find("im\\:collection").children().eq(0).text(); 
		var sample = $(this).find("link").eq(1).attr("href");
		var videoLink = getVideoLink(title, artist);
				
		$("#songs").append(
			"<tr>" +
				"<td>" + title + "</td>" +
				"<td>" + artist + "</td>" +
				"<td>" + album + "</td>" +
				"<td><img src=\"" + songImage + "\"/></td>" +
				"<td><audio controls>" +
				  "<source src=\"" + sample + "\" type=\"audio/x-m4a\">" +
				  "<source src=\"" + sample + "\" type=\"audio/x-m4a\">" +
				"Your browser does not support the audio element." +
				"</audio></td>" +
				"<td>" + videoLink + "</td>" +
			"</tr>");
	});
}

/**
	Returns a string that links to a youtube page for the artist and song searched
**/
var getVideoLink = function(title, artist){
	//You will need to supply a Google API key
	var apiKey = "INSERT_API_KEY_HERE";
	var urlString = "https://www.googleapis.com/youtube/v3/search?q=" + title + artist + "&part=snippet&maxResults=" + 1 + "&key=" + apiKey;
	var videoTag = "";
	
	//This ajax code found at http://stackoverflow.com/a/1008786/2400244
	$.ajax({
		  url: urlString,
		  async: false,
		  dataType: 'json',
		  success: function (json) {
			var videoArray = json.items;
			
			for(i=0;i<videoArray.length;i++){
				var id = videoArray[i].id.videoId;
				
				videoTag = "<a href=\"http://www.youtube.com/watch?v=" + id +"\" target=\"blank\"><img src=\"images/youtube_logo.png\" height=\"50\" width=\"50\"></a>"	
			}
		}
	});

	return videoTag;
}

/**
	Gets top song list from iTunes. Accepts two parameters, country and songNumber, which are inserted into URL.  Displays song list in HTML.
**/
var getSongs = function( country, songNumber ){
	  $.get("https://itunes.apple.com/" + country + "/rss/topsongs/limit=" + songNumber + "/xml", function(data){
		var songArray = $(data).find("entry");
		appendValues(songArray); 
		
	}, "xml");
}

/**
	Gets user input from dropdown menu and slider. Calls getSongs function to update song list.
**/
var updateSongs = function(){
	
	var country = getCountry();
	
	//Get song number input
	var songNumber = $("#slider").slider("value");

	
	//setupSlider();
	
	//Refresh song list
	getSongs(country, songNumber + 1);
}

/**
	Changes text in span #number with number from slider
**/
var updateSliderText = function(){
	var value = $("#slider").slider("value");			
	$( "#number" ).text(value);
}

/**
	Setup Jquery slider with min 5 and max 30
**/
var setupSlider = function(){
	//Sets up the slider
	$("#slider").slider({
		orientation: "horizontal",
		min: 4,
		max: 31,
		value: 10,
		slide: updateSliderText
	});
}

/**
	Get user input from dropdown menu
**/
var getCountry = function(){
	//Get country input
	var country = $("#dropdown").val();
	
	if (country == "united_states"){
		country = "us";
	} else if(country == "india"){
		country = "in";
	} else {
		country = "tr";
	}
	
	return country;
}

/**
	Erase all table rows except for the top two
**/
var erase = function(){
	$("#songs tr").slice(2).remove();
}


$(document).ready(function(){
	
	setupSlider();
	
	var country = getCountry();
	var val = $("#slider").slider("option", "value");
	getSongs(country, val);
	
	//On Update click, erase the old song list and update with current list.
	$("#update").click(function() {
		erase();
		updateSongs();
	});
});

