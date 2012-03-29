$(function() {
	// Although unrealistic, there is no limit on this value.
	// I have no particular good reason for this other than the challenge of making the plugin scalable
	// and driving myself to drink.
	var numberOfCards = 5;

	// The element to draw the hand in 
	var el = 'body';

	// X,Y coords to center the hand from (relative to parent element)
	// In this case I'm simply centering in the screen
	var originX = $(document).width() / 2;
	var originY = $(document).height() / 2;

	// Again there is no limit on this for no good reason :)
	var cardWidth = 200;

	// Set defaults in the form
	$('#numberOfCards').val(numberOfCards);
	$('#originX').val(originX);
	$('#originY').val(originY);
	$('#cardWidth').val(cardWidth);

	$('#drawHand').click(function() {

		// Delete cards before drawing a new hand
		$('.playing-card').remove();

		originX = parseInt($('#originX').val());
		originY = parseInt($('#originY').val());
		numberOfCards = parseInt($('#numberOfCards').val());		
		cardWidth = parseInt($('#cardWidth').val());

		// *A standard playing card has a H:W ratio of 1.4
		var cardHeight = cardWidth * 1.4;

		// If the user wants to see the origin of the hand for design purposes		
		var showOrigin = true;

		drawHand(el, originX, originY, numberOfCards, cardWidth, cardHeight, true);
	});
});

// Draw the hand on the screen
function drawHand(el, originX, originY, numberOfCards, cardWidth, cardHeight, showOrigin) {
	// The angle off the origin that each card will be referenced from
	// The +1 is added because we want the first card to be positioned above the origin
	var angle = 180 / (numberOfCards + 1);

	// How far each card will be from the origin of the hand.
	// This is proportional to the size of the card so that larger cards avoid too much overlap
	var radius = cardWidth * 1.2;

	// Through trial & error I determined a small hand (3-5 cards) looks most realistic 
	// when the end cards are at a rotation of 30 degrees (90 - 5 * 12). However when larger hands are created
	// the end cards must be rotated at a larger angle in order to be "held" properly.  Anything that would
	// calculate to an angle > 30 (6 cards or more) is simply capped at 45 degrees.
	var endRotation = 12 * numberOfCards > 60 ? 45 : 90 - 12 * numberOfCards;

	// Find an equal angle to split the cards across the entire hand
	var rotationIncrement = endRotation * 2 / (numberOfCards + 1);

	// If the user wants to see the origin for debugging/design purposes, show an X there
	if (showOrigin) {
		$(el).append($('<span>X</span>').css('color', 'red').css('position', 'absolute').css('top', originY + 'px').css('left', originX + 'px'));
	}

	// Loop through each card
	// *Note: I start at 1 (instead of 0) in order to avoid multiplying by 0 and ending up with flat angles. 
	// 	If you are using an array of cards (eventual scenario) you would need to account for the 0 index 
	for (var i = 1; i <= numberOfCards; i++) {

		//	Set the card rotation - always rotate from the end point so use the card number as a multiplier
		var rotation = endRotation - rotationIncrement * i;

		// The X,Y coordinates of each card.
		// Note that the origin X,Y is added to each coordinate as a hand would almost never be generated from 0,0 
		// on an HTML canvas.
		var x = radius * Math.cos(toRadians(angle * i)) + originX;
		var y = radius * Math.sin(toRadians(-angle * i)) + originY;

		// This next algorithm is used to push the cards "up" by a larger amount the further you get from the middle of the hand.  
		// This is done because a higher number of cards will start to push down and form a sharper circle. 
		// By moving them up it evens out the semi-circle to appear like something that would be more realistically held by a human.	
		// And as usual, this value is affected by existing variables to always position the hand based on its previous metrics.		
		y = y - Math.abs(Math.round(numberOfCards / 2) - i) * rotationIncrement;

		// HTML positions elements relative to the top left corner, but the CSS3 "rotation" property uses the center.  
		// So I cut the values in half and use the center to position the cards.
		// *Note: I realize both this and the previous line could have been included in the first X,Y calculation. They are separated for clarity.
		x = x - cardWidth / 2;
		y = y - cardHeight / 2;		

		// Create the card using my jQuery plugin
		var $card = $('<div></div>').card({
			width: cardWidth,
			text: i,
			rotation: rotation,
			top: y,
			left: x
		});		

		// Draw it in the parent element
		$(el).append($card);
	}
}

// Helper function to convert to radians from degrees since Javascript's Math library defaults to radians.
function toRadians(degrees) {
	return degrees * Math.PI / 180;
}
