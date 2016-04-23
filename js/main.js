/* global YT, Shine, shinejs */

var lhFunctions = function(){

	this.adjust_height = function(){
		setTimeout(function(){
			$("section.full-height").css( "min-height", $(window).outerHeight()+"px" );
		}, 1);
	};

	this.animate_numbers = function(){
		$(".fact_box span.number").each(function(){
			var num = this;
			if($(num).isOnScreen() && $(num).text() == 0){
				$({count: 0}).animate({
					count: $(num).attr("data-target_num"),
				}, {
					duration: 1000,
					easing: 'swing',
					step: function(){
						if($(num).attr("data-target_num") > 10){
							$(num).text(Math.floor(this.count));
						} else {
							$(num).text(Math.round(this.count * 100) / 100);
						}
					},
					complete: function(){
						$(num).text(Math.round(this.count * 100) / 100);
					}
				});
			} else if (!$(num).isOnScreen()){
				$(num).text(0);
			}
		});

		$(".fact_box .bar[data-target_num]").each(function(){
			var bar = this;
			if($(bar).isOnScreen() && $(bar).width() == 0){
				$(bar).animate({
					width: $(bar).attr("data-target_num") + "%",
				}, {
					duration: 1000,
					easing: 'swing',
				});
			} else if (!$(bar).isOnScreen()){
				$(bar).width(0);
			}
		});
	};

	this.build_navigation = function(){
		$("section[id]").each(function(){
			var navElem = $("<a></a>").attr("href", "#"+$(this).attr("id")).addClass("fa fa-circle-o").attr("title", $(this).attr("data-title"));
			$(".side_nav_container").append(navElem);
		});
	};

	this.setActiveSidenav = function(){
		var scrollTop = $(window).scrollTop();
		var activeStack = [];

		$("section[id]").each(function(){
			var sectionBottom = $(this).offset().top + ($(this).outerHeight() * 0.75);
			if(scrollTop < sectionBottom){
				activeStack.push($(this));
			}
		});

		if(activeStack.length > 0){
			var $activeItem = activeStack.shift();
			$(".side_nav_container a").removeClass("fa-circle").addClass("fa-circle-o");
			$(".side_nav_container a[href=#"+$activeItem.attr("id")+"]").removeClass("fa-circle-o").addClass("fa-circle");
		}
	};
};

var lhYtApi = function(){
	this.player = null;

	this.loadVideo = function(ytid, target){

		this.player = new YT.Player(target, {
          videoId: ytid,
          playerVars: { 'autoplay': 1,
						'controls': 0,
						'playsinline': 1,
						'showinfo': 0,
						'loop': 1,
						'rel': 0,
						'playlist': ytid,
						},
          events: {
            'onReady': this.onPlayerReady,
            'onStateChange': this.onStateChange,
          }
        });

		$("#"+target).css("opacity", 0);

		this.setPlayerSize(target);
		var that = this;
		var delayer = null;

		$(window).on("resize", function(){
			clearTimeout(delayer);
			delayer = setTimeout(function(){
				that.setPlayerSize(target);
			}, 500);
		});

		$(window).on("scroll", function(){
			clearTimeout(delayer);
			delayer = setTimeout(function(){

				if($("#"+target).parents("section").isOnScreen()){
					that.player.playVideo();
				} else {
					that.player.pauseVideo();
				}

			}, 100);
		});

	};

	this.onPlayerReady = function(e){
		e.target.mute();
	};

	this.onStateChange = function(e){
		if(e.data == YT.PlayerState.PLAYING){
			$(e.target.a).animate({
				"opacity": 1,
			}, 500);
		} else {

		}
	};

	this.setPlayerSize = function(target){
		var ar = 16/9;
		var winAR = $(window).innerWidth() / $(window).innerHeight();
		var h = 0;
		var w = 0;
		var marLeft = 0;

		if( winAR > ar){
			w = $(window).innerWidth();
			h = w / 16 * 9;
			marLeft = 0;
		} else {
			h = $(window).innerHeight();
			w = h / 9 * 16;
			marLeft = (w - $(window).innerWidth()) / 2 * -1;
		}

        $("#"+target).css("margin-left", marLeft+"px").height(h).width(w);
	};
};

function onYouTubeIframeAPIReady(){
	var yt = new lhYtApi();
	yt.loadVideo("3ucd6-wAvAU", "title-card-player");
}

// Do stuff on DOM Ready
$(document).ready(function(){
	var lh_functions = new lhFunctions();
	lh_functions.adjust_height();
	lh_functions.animate_numbers();
	lh_functions.build_navigation();
	lh_functions.setActiveSidenav();

	var delayer = null;
	$(window).on("resize", function(){
		clearTimeout(delayer);
		delayer = setTimeout(function(){
			lh_functions.adjust_height();
		}, 500);
	});

	// Show and hide the little fixed footer nav
	var delayer2 = null;
	$(window).on("scroll", function(){
		clearTimeout(delayer2);
		delayer2 = setTimeout(function(){
			var onScreen = false;
			$(".join_button").each(function(){
				if($(this).isOnScreen()){ onScreen = true; }
			});

			if(onScreen){
				$(".footer-nav").removeClass("visible");
			} else {
				$(".footer-nav").addClass("visible");
			}

			lh_functions.animate_numbers();
			lh_functions.setActiveSidenav();
		}, 100);
	});


	// Check if we got mobile stuff
	if(!isMobile.any){
		// Load the Youtube API
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}

	// Load SOE Stuff
	var soe = new soeCensusApi();
	soe.init();


});