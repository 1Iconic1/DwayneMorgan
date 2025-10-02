(function($) {

    var $window = $(window),
        $body = $('body'),
        $sidebar = $('#sidebar');

    // Breakpoints.
    breakpoints({
        xlarge: [ '1281px',  '1680px' ],
        large:  [ '981px',   '1280px' ],
        medium: [ '737px',   '980px'  ],
        small:  [ '481px',   '736px'  ],
        xsmall: [ null,      '480px'  ]
    });

    // Hack: Enable IE flexbox workarounds.
    if (browser.name == 'ie')
        $body.addClass('is-ie');

    // Play initial animations on page load.
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');

            // Fallback: Ensure visible sections near viewport are shown
            $('.wrapper, .spotlights > section, .features').each(function() {
                var $this = $(this);
                // Only remove inactive if element is near top of page
                if ($this.offset().top < $window.scrollTop() + $window.height()) {
                    $this.removeClass('inactive');
                }
            });
        }, 500); // Increased from 100ms to 500ms for more reliable loading
    });

    // Safety net: Force show everything after max 3 seconds
    window.setTimeout(function() {
        $body.removeClass('is-preload');
        $('.inactive').removeClass('inactive');
    }, 3000);

    // Forms.

    // Hack: Activate non-input submits.
    $('form').on('click', '.submit', function(event) {
        // Stop propagation, default.
        event.stopPropagation();
        event.preventDefault();

        // Submit form.
        $(this).parents('form').submit();
    });

    // Sidebar.
    if ($sidebar.length > 0) {
        var $sidebar_a = $sidebar.find('a');

        $sidebar_a
            .addClass('scrolly')
            .on('click', function() {
                var $this = $(this);

                // External link? Bail.
                if ($this.attr('href').charAt(0) != '#')
                    return;

                // Deactivate all links.
                $sidebar_a.removeClass('active');

                // Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
                $this
                    .addClass('active')
                    .addClass('active-locked');
            })
            .each(function() {
                var $this = $(this),
                    id = $this.attr('href'),
                    $section = $(id);

                // No section for this link? Bail.

                if ($section.length < 1)
                    return;

                // Scrollex with error handling.
                if ($.fn.scrollex) {
                    $section.scrollex({
                        mode: 'middle',
                        top: '-20vh',
                        bottom: '-20vh',
                        initialize: function() {
                            // Deactivate section.
                            $section.addClass('inactive');
                        },
                        enter: function() {
                            // Activate section.
                            $section.removeClass('inactive');

                            // No locked links? Deactivate all links and activate this section's one.
                            if ($sidebar_a.filter('.active-locked').length == 0) {
                                $sidebar_a.removeClass('active');
                                $this.addClass('active');
                            }

                            // Otherwise, if this section's link is the one that's locked, unlock it.
                            else if ($this.hasClass('active-locked'))
                                $this.removeClass('active-locked');
                        }
                    });
                } else {
                    // Scrollex not available, just show the section
                    $section.removeClass('inactive');
                }
            });
    }

    // Scrolly.
    $('.scrolly').scrolly({
        speed: 1000,
        offset: function() {
            // If <=large, >small, and sidebar is present, use its height as the offset.
            if (breakpoints.active('<=large')
                && !breakpoints.active('<=small')
                && $sidebar.length > 0)
                return $sidebar.height();

            return 0;
        }
    });

    // Spotlights.
    if ($.fn.scrollex) {
        $('.spotlights > section')
            .scrollex({
                mode: 'middle',
                top: '-10vh',
                bottom: '-10vh',
                initialize: function() {
                    // Deactivate section.
                    $(this).addClass('inactive');
                },
                enter: function() {
                    // Activate section.
                    $(this).removeClass('inactive');
                }
            })
    } else {
        $('.spotlights > section').removeClass('inactive');
    }

    $('.spotlights > section')
        .each(function() {
            var $this = $(this),
                $image = $this.find('.image'),
                $img = $image.find('img'),
                x;

            // Assign image.
            $image.css('background-image', 'url(' + $img.attr('src') + ')');

            // Set background position.
            if (x = $img.data('position'))
                $image.css('background-position', x);

            // Hide <img>.
            $img.hide();
        });

    // Features.
    if ($.fn.scrollex) {
        $('.features')
            .scrollex({
                mode: 'middle',
                top: '-20vh',
                bottom: '-20vh',
                initialize: function() {
                    // Deactivate section.
                    $(this).addClass('inactive');
                },
                enter: function() {
                    // Activate section.
                    $(this).removeClass('inactive');
                }
            });
    } else {
        $('.features').removeClass('inactive');
    }

    // Popup functionality.
    document.querySelectorAll(".features").forEach(function(feature) {
		// Select the "Read More" button in each feature section
		feature.addEventListener("click", function(event) {
			if (event.target.tagName.toLowerCase() === "button") {
				const item = event.target.parentElement; // Get the parent section of the button
				const h3 = item.querySelector("h3").innerHTML;
				const readMoreCont = item.querySelector(".read-more-cont").innerHTML;

				// Update popup content
				const popup = document.querySelector(".popup-box");
				popup.querySelector("h3").innerHTML = h3;
				popup.querySelector(".popup-body").innerHTML = readMoreCont;

				// Show the popup
				popupBox();
			}
		});
	});

	// Close popup logic
	const popup = document.querySelector(".popup-box");
	const popupCloseBtn = popup.querySelector(".popup-close-btn");
	const popupCloseIcon = popup.querySelector(".popup-close-icon");
    popupCloseBtn.addEventListener("click", popupBox);
    popupCloseIcon.addEventListener("click", popupBox);

    popup.addEventListener("click", function(event) {
        if (event.target == popup) {
            popupBox();
        }
    });

    function popupBox() {
        popup.classList.toggle("open");
    }

})(jQuery);
