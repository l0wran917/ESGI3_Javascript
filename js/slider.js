var url = "https://www.skrzypczyk.fr/slideshow.php";
var compressUrl = 'https://img.gs/zqxmjnbkgf/full/';
var transitionSpeed = 2000;
var displayTime = 1000;

// -----------
var timer = null;
var stop = false;
var photos = [];
var current = 0;

function getPicturesData() {
    $.getJSON(url, function (data) {
        for (var i = 0; i < data.length; i++) {
            var dot = $("<li/>");
            dot.attr('data-id', i);
            $("#dots ul").append(dot);
        }

        $("#dots li").on('click', dotsEvent);
        $("#dots li:first-child").addClass('active');

        data.forEach(function (photo) {
            var url = compressUrl + photo.url;

            $("<img />").attr('src', url).on('load', function () {

                var image = $('<div />', {
                    alt: photo.desc,
                    class: 'image',
                    style: 'opacity: 0;background-image: url(' + url + ')'
                });
                photos.push(photo);

                $("#rail").append(image);

                $(image).stop().animate({
                    opacity: 1
                }, 1000);
                $("#loading").hide();

                if (!timer) {
                    startTimer();
                    changeActiveDot();
                    $("#data .title").text(photo.title);
                    $("#data .description").text(photo.desc);
                }
            });
        });

    }, function () {
        console.log('ERREUR 01');
    });
}

function startTimer() {
    if (!timer) {
        timer = setInterval(moveNext, displayTime);
    }
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function changeActiveDot(direction) {
    if ($("#rail").is(':animated') || photos.length <= 1) {
        return false;
    }

    direction = (direction ? direction : 1);
    current = (current + direction) % photos.length;

    current = (current < 0 ? current + photos.length : current);

    $("#data .title").text(photos[current].title);
    $("#data .description").text(photos[current].desc);

    $("#dots li.active").removeClass("active");
    $($("#dots li")[current]).addClass("active");
}

function moveNext() {
    if ($("#rail").is(':animated') || photos.length <= 1) {
        return false;
    }

    changeActiveDot(1);
    var imageWidth = $(".image").width();
    $("#rail").stop().animate({"margin-left": -imageWidth}, transitionSpeed, changeImageOrder);

    $("#data .title").stop().animate({"left": imageWidth, "opacity": 0}, (transitionSpeed / 4) * 3, function () {
        $("#data .title").css({"left": -150});
        $("#data .title").stop().animate({"left": 25, "opacity": 1}, transitionSpeed / 5);
    });

    $("#data .description").stop().animate({"left": imageWidth, "opacity": 0}, (transitionSpeed / 5) * 4, function () {
        $("#data .description").css({"left": -150});
        $("#data .description").stop().animate({"left": 25, "opacity": 1}, transitionSpeed / 4);
    });
}

function movePrevious() {
    if ($("#rail").is(':animated') || photos.length <= 1) {
        return false;
    }

    changeActiveDot(-1);
    var imageWidth = $(".image").width();
    $("#rail .image:last").insertBefore($("#rail .image:first"));

    $("#rail").css({'margin-left': -imageWidth});
    $("#rail").stop().animate({"margin-left": 0}, transitionSpeed);

    var textWidth = $("#data .description").width();
    $("#data .description").stop().animate({"left": -textWidth, "opacity": 0}, transitionSpeed / 5, function () {
        $("#data .description").css({"left": imageWidth});
        $("#data .description").stop().animate({"left": 25, "opacity": 1}, (transitionSpeed / 4) * 3);
    });

    $("#data .title").stop().animate({"left": -textWidth, "opacity": 0}, transitionSpeed / 4, function () {
        $("#data .title").css({"left": imageWidth});
        $("#data .title").stop().animate({"left": 25, "opacity": 1}, (transitionSpeed / 5) * 4);
    });

}

function changeImageOrder() {
    $("#rail .image:last").after($("#rail .image:first"));
    $("#rail").css({'margin-left': "0"});
}

$("#slideshow").mouseover(function () {
    stopTimer();
});

$("#slideshow").mouseout(function () {
    if (!stop) {
        startTimer();
        $("#overlay").stop().animate({
            'opacity': '1'
        }, 500);
    }
});

$("#control .right").click(moveNext);
$("#control .left").click(movePrevious);

$("#pause").click(function () {

    $("#pause i").toggleClass('fa-pause');
    $("#pause i").toggleClass('fa-play');

    stop = !stop;
    if (stop) {
        stopTimer();
    } else {
        startTimer();
    }
});

function dotsEvent() {
    var target = $(this).attr('data-id');
    var nextTimer = null;
    var oldTransitionSpeed = transitionSpeed;
    var oldDisplayTime = displayTime;
    transitionSpeed = 250;
    displayTime = 0;
    nextTimer = setInterval(function(){
        moveNext();
        if(current === parseInt(target)){
            transitionSpeed = oldTransitionSpeed;
            displayTime = oldDisplayTime;
            clearInterval(nextTimer);
        }
    }, 150);
}

getPicturesData();
