
// Object for app
var cocktailApp = {};

// Array for initial data to be stored, "get more" button will
// go through this array until empty. "shift" will remove each
// one after gone through loop and has been displayed.
var recipeArray = [];


// Add 'selected' class when choice is made
$('.spirit2').on('change', function() {
	$('.spirit2').removeClass('selected'); 
	$(this).addClass('selected');
});
$('.mix2').on('change', function() {
	$('.mix2').removeClass('selected'); 
	$(this).addClass('selected');
});

// Code to run when app kicks off
cocktailApp.init = function () {

// On click of submit button, send selected choices into
// ajax call parameters
	$('form').on('submit', function(event) {
		event.preventDefault();

// Hide submit button and show get more and reset button
		$('.submit').hide();
		$('.get-more').show();
		$('.reset').show();

// store value of user's choices in variables
		var spiritChoice = $('input[name=spirit]:checked').val();

		var mixChoice = $('input[name=mix]:checked').val();

// Concatenate both choices into one variable
		var userChoices = spiritChoice + " " + mixChoice;

// hide get more button when new choices are selected
// and show submit button
		$('input[type=radio]').on('change', function (){
			$('.submit').show();
			$('.get-more').hide();
		});

// Empty Result container on submit to clear for new results
		$('.recipe-container').empty();

// Get data based on users selections
		cocktailApp.getData(userChoices);

	});

// Get More button runs display.Recipe through recipeArray
	$('.get-more').on('click', function () {
		$('.recipe-container').empty();
		cocktailApp.displayRecipe(recipeArray);
		$.smoothScroll({
			scrollTarget: 'main'
		});	
	});
// Reset Button, removes results container, resets values, shows Submit Button 
	$('.reset').on('click', function (event) {
		event.preventDefault();
		$('.recipe-container').empty();
		$('.submit').show();
		$('.spirit2').removeClass('selected');
		$('.mix2').removeClass('selected');
		$('.get-more').hide();
		$('input[name=spirit]:checked').val('any');
		$('input[name=mix]:checked').val('any');
		$('.reset').hide();  
	});

};

cocktailApp.getData = function (searchRecipe) {

// Make Ajax call to get data
	 $.ajax( {
	 	url: 'https://api.yummly.com/v1/api/recipes',
	 	method: 'GET',
	 	dataType: 'jsonp',
	 	data: {
	 		_app_id: '3ddd4c2f',
	 		_app_key: 'fa580e68dd3f8098e5dc06b8f736b1d5',
	 		requirePictures: true,
	 		allowedCourse: 'course^course-Cocktails',
	 		maxResult: 32,
	 		q: searchRecipe + " cocktail"
	 	}
	 })
	 .then(function(data) {
	 	// Declare recipeArray, for use of Get More(results) option
	 	recipeArray = data.matches;
	 	cocktailApp.displayRecipe(recipeArray);
	 	
	 });

};
// Display recipes
cocktailApp.displayRecipe = function(recipes) {
// Using for loop, grab data from each recipe and
// send to html. 
 	for(var i = 0; i < 4; i++) {
 		// var recipe object
 		var item = recipes[0];
 		// console.log(item);
 		// var for recipe rating
 		var recipeRating = $('<p>').html("Rating: " + "<span>" + item.rating + "/5</span>").addClass('ratingP');
 		// var for total time converted from seconds to minutes
 		var timeInMinutes = item.totalTimeInSeconds / 60;
 		// var for recipe time using timeInMinutes
 		var recipeTime = $('<p>').html("Time: " + "<span>" + timeInMinutes + " min</span>").addClass('timeP');
 		// var for Image and titles
		var recipeImage = $('<img>').attr("src", item.smallImageUrls[0].replace(/s90/g, 's360'));
		var recipeTitle = $('<h3>').text(item.recipeName);
		var ingredientTitle = $('<h4>').text("What You Need:");

		// var for ingredient item list
		var ingredient = item.ingredients; 
		// Create UL list with class to hold the ingredient items
		var ingredientList = $('<ul>').addClass('ingredient-list');
		// For each ingredient in list, append as a <li> item to the ingredientList
		ingredient.forEach(function(ingredientItem) {
			ingredientList.append('<li>' + ingredientItem + '</li>');
		});
		// Concatenate base url with recipe id to create link to view full recipe on yummly
		var recipeId = "http://www.yummly.com/recipe/" + item.id;
		// Send recipeId into href attribute of an <a> tag
		var recipeLink = $('<a target="_blank">').attr("href", recipeId).text('View Full Recipe');
		// Append all variables into div with a class of 'recipe-item'
		var recipeBox = $('<div>').addClass('recipe-item').append(recipeRating, recipeTime, recipeImage, recipeTitle, ingredientTitle, ingredientList, recipeLink);
		// Append recipeBox into the recipe-container on html page
		$('.recipe-container').append(recipeBox);
		// Remove each recipe from recipeArray after it has been looped through, this is
		// done so Get More option will go through the objects of original ajax call.
		recipeArray.shift();
		// console.log(recipes)
		
	};

};

// Document Ready

$(function() {
	cocktailApp.init();

		// Smooth scroll on click
	$('.submit').on('click', function(){
		$.smoothScroll({
			scrollTarget: 'main'
		});
	});

});

