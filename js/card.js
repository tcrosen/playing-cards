// ===============================================================================
//
//	Card
//
!
function($) {

	"use strict"

	// --------------------------------------------------------
	//
	//  Constructor
	//
	var Card = function(element, options) {
			this.$element = $(element);
			this.options = $.extend({}, $.fn.card.defaults, options);

			this.cssProps = {
				width: this.options.width,
				// 	A standard playing card is 2.5" x 3.5", a ratio of 1.4
				height: this.options.height || this.options.width * 1.4,				
				backgroundColor: this.options.backgroundColor,
				rotation: this.options.rotation,
				top: this.options.top,
				left: this.options.left
			};

			this.icon = this.options.icon || '';
			this.text = this.options.text || '';

			this.draw();
			this.listen();
		}

	Card.prototype = {

		constructor: Card,

		draw: function() {
			var $card = this.$element;

			$card.css({
				'padding': '0',
				'margin': '0',			
				'-webkit-border-radius': '6px',
				'-moz-border-radius': '6px',
				'border-radius': '6px',
				'-webkit-box-shadow': '3px 3px 20px #333',
				'-moz-box-shadow': '3px 3px 20px #333',
				'box-shadow': '3px 3px 20px #333',
				'border-width': '8px',
				'border-style': 'solid',
				'border-color': '#333',
				'cursor': 'pointer',
				'width': this.cssProps.width + 'px',
				'height': this.cssProps.height + 'px',
				'background-color': this.cssProps.backgroundColor,
				'transform': 'rotate(' + this.cssProps.rotation + 'deg)',
				'-ms-transform': 'rotate(' + this.cssProps.rotation + 'deg)',
				'-moz-transform': 'rotate(' + this.cssProps.rotation + 'deg)',
				'-webkit-transform': 'rotate(' + this.cssProps.rotation + 'deg)',
				'-o-transform': 'rotate(' + this.cssProps.rotation + 'deg)',
				'position': 'absolute',
				'top': this.cssProps.top + 'px',
				'left': this.cssProps.left + 'px'
			}).addClass('playing-card');

			if (this.icon != '') {
				$card.append($('<img src="' + this.icon + '" />').css({
					'position': 'absolute',
					'top': (this.cssProps.height / 5) + 'px',
					'left': (this.cssProps.width / 2) + 'px',
					'margin-left': '-24px'
				}));
			}

			if (this.text != '') {
				$card.append($('<div>' + this.text + '</div>').css({
					'position': 'absolute',
					'top': (this.cssProps.height / 2 - 15) + 'px',
					'width': '100%',
					'text-align': 'center',
					'font-size': '26px',
					'line-height': '30px'
				}));
			}
		}

		,
		listen: function() {
			this.$element.on('mouseenter', $.proxy(this.mouseenter, this)).on('mouseleave', $.proxy(this.mouseleave, this)).on('click', $.proxy(this.click, this));
		}

		,
		mouseenter: function() {
			$.data(this.$element, 'border-color', this.$element.css('border-top-color'));
			this.$element.stop(true, true).animate({
				borderColor: "#46a546"
			}, 1000, 'linear');
		}

		,
		mouseleave: function() {
			this.$element.stop(true, true).css('border-color', $.data(this.$element, 'border-color'));
		}

	}

	// --------------------------------------------------------
	//
	//  Plugin definition
	//
	$.fn.card = function(option) {
		return this.each(function() {
			var $this = $(this)
			var data = $this.data('card');
			var options = typeof option == 'object' && option;
			if (!data) $this.data('card', (data = new Card(this, options)))
			if (typeof option == 'string') data[option]()
		});
	}

	// --------------------------------------------------------
	//
	//  Defaults
	//
	$.fn.card.defaults = {
		width: 100,		
		backgroundColor: '#fff',
		rotation: 0
	};

	$.fn.card.Constructor = Card;

}(jQuery);
