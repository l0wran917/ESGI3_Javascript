var url = "https://www.skrzypczyk.fr/slideshow.php";
var compressUrl = 'https://img.gs/zqxmjnbkgf/full/';
var transitionSpeed = 2000;
var displayTime = 2000;

// -----------
var timer = null;
var stop = false;
var photos = [];
var current = 0;


function getPicturesData() {
    $.getJSON(url, function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#dots ul").append($("<li/>"));
        }

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
        timer = setInterval(moveNext, transitionSpeed + displayTime);
    }
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function changeActiveDot(direction) {
    direction = (direction ? direction : 1);
    current = (current + direction) % photos.length;

    current = (current < 0 ? current + photos.length : current);

    $("#dots li.active").removeClass("active");
    $($("#dots li")[current]).addClass("active");
}

function moveNext() {
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

    $("#data .title").text(photos[current].title);
    $("#data .description").text(photos[current].desc);
}

function movePrevious() {
    changeActiveDot(-1);
    var imageWidth = $(".image").width();
    $("#rail .image:last").insertBefore($("#rail .image:first"));

    $("#rail").css({'margin-left': -imageWidth});
    $("#rail").stop().animate({"margin-left": 0}, transitionSpeed);

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
    }else{
        startTimer();
    }
});

getPicturesData();
