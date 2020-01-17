// variables
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
    // setup garden
	$loveHeart = $("#loveHeart");
	var offsetX = $loveHeart.width() / 2;
	var offsetY = $loveHeart.height() / 2 - 55;
    $garden = $("#garden");
    gardenCanvas = $garden[0];
	gardenCanvas.width = $loveHeart.width();
	gardenCanvas.height = $loveHeart.height();
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);

	//$("#contentDiv").css("width", $loveHeart.width() + $("#code").width());
	//$("#contentDiv").css("height", Math.max($loveHeart.height(), $("#code").height()));
	//$("#contentDiv").css("margin-top", Math.max(($window.height() - $("#contentDiv").height()) / 2, 10));
	//$("#contentDiv").css("margin-left", Math.max(($window.width() - $("#contentDiv").width()) / 2, 10));

    // renderLoop
    setInterval(function () {
        garden.render();
	}, Garden.options.growSpeed);

	// swithc color theme by time
	var longitude = 116.46;
	var latitude = 39.92;
	getSunsetSunrise(longitude, latitude);
});

$(window).resize(function() {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth && newHeight != clientHeight) {
        location.replace(location);
    }
});

function getHeartPoint(angle) {
	var t = angle / Math.PI;
	var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
	var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
	return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
	var interval = 50;
	var angle = 10;
	var heart = new Array();
	var animationTimer = setInterval(function () {
		var bloom = getHeartPoint(angle);
		var draw = true;
		for (var i = 0; i < heart.length; i++) {
			var p = heart[i];
			var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
			if (distance < Garden.options.bloomRadius.max * 1.3) {
				draw = false;
				break;
			}
		}
		if (draw) {
			heart.push(bloom);
			garden.createRandomBloom(bloom[0], bloom[1]);
		}
		if (angle >= 30) {
			clearInterval(animationTimer);
			showMessages();
		} else {
			angle += 0.2;
		}
	}, interval);
}

(function($) {
	$.fn.typewriter = function() {
		this.each(function() {
			var $ele = $(this), str = $ele.html(), progress = 0;
			$ele.html('');
			var timer = setInterval(function() {
				var current = str.substr(progress, 1);
				if (current === '<') {
					progress = str.indexOf('>', progress) + 1;
				} else {
					progress++;
				}
				$ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
				if (progress >= str.length) {
					clearInterval(timer);
				}
			}, 75);
		});
		return this;
	};
})(jQuery);

function timeElapse(date){
	var current = new Date();
	var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
	var days = Math.floor(seconds / (3600 * 24));
	seconds = seconds % (3600 * 24);
	var hours = Math.floor(seconds / 3600);
	if (hours < 10) {
		hours = "0" + hours;
	}
	seconds = seconds % 3600;
	var minutes = Math.floor(seconds / 60);
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	seconds = seconds % 60;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds";
	$("#elapseClock").html(result);
}

function showMessages() {
	adjustWordsPosition();
	$('#messages').fadeIn(5000, function() {
		showLoveU();
	});
}

function adjustWordsPosition() {
	$('#words').css("position", "absolute")
		.css("top", 195)
		.css("left", 70);
}

function adjustCodePosition() {
	$('#code').css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
}

function showLoveU() {
	$('#loveu').fadeIn(3000);
}

function switchColorTheme(theme) {
	if (!theme) {
		theme = document.body.classList.contains('dark') ? 'light' : 'dark';
	}
	if (theme === 'dark') {
		document.body.classList.add('dark');
		document.getElementById('words').classList.add('dark');
		document.getElementById('code').classList.add('dark');
	} else {
		document.body.classList.remove('dark');
		document.getElementById('words').classList.remove('dark');
		document.getElementById('code').classList.remove('dark');
	}
}

/**
 * 获取日出、日落时间（用简化的公式，忽略额外细微因素）
 *
 * @param {float} longitude 经度，度数表示
 * @param {float} latitude 纬度，度数表示
 */
function getSunsetSunrise(longitude, latitude) {
	var now = new Date();
	$.get('https://api.sunrise-sunset.org/json', {
		 lat: latitude,
		 lng: longitude,
		 date: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
		 formatted: 0
	}).done(function (resp) {
		if (resp.status === 'OK') {
			console.debug(resp.results);
			var sunset = new Date(resp.results.sunset);
			var sunrise = new Date(resp.results.sunrise);
			if (sunrise < now && now < sunset) {
				switchColorTheme('light');
			} else {
				switchColorTheme('dark');
			}
		} else {
			if (now.getHours() >= 17 || now.getHours.getHours() < 7) {
				switchColorTheme('dark');
			} else {
				switchColorTheme('light');
			}
		}
	}).fail(function () {
		if (now.getHours() >= 17 || now.getHours.getHours() < 7) {
			switchColorTheme('dark');
		} else {
			switchColorTheme('light');
		}
	});
}