var url = "https://www.skrzypczyk.fr/slideshow.php";
var compressUrl = 'https://img.gs/zqxmjnbkgf/full/';
var transitionSpeed = 2000;
var displayTime = 2000;

// -----------
var timer = null;
var photos = [];
var loadedCount = 0;
var current = 0;


function getPicturesData() {
    $.getJSON(url, function (data) {
        for(var i = 0 ; i < data.length ; i++){
            $("#dots ul").append($("<li/>"));
        }

        data.forEach(function(photo){
            var url = compressUrl + photo.url;

            $("<img />").attr('src', url).on('load', function(){

                var image = $('<div />', {
                    alt: photo.desc,
                    class: 'image',
                    style: 'opacity: 0;background-image: url(' + url + ')'
                });
                photos.push(photo);

                $("#rail").append(image);

                $(image).stop().animate({
                    opacity : 1
                }, 1000);
                $("#loading").hide();

                if(!timer){
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
    timer = setInterval(moveNext, transitionSpeed + displayTime);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function changeActiveDot(){
    $("#dots li.active").removeClass("active");
    current = (current + 1) % photos.length;
    $($("#dots li")[current]).addClass("active");
}

function moveNext() {
    changeActiveDot()
    var imageWidth = $(".image").width();
    $("#rail").stop().animate({"margin-left": -imageWidth}, transitionSpeed, changeImageOrder);

    $("#data .title").animate({"left": imageWidth, "opacity": 0}, (transitionSpeed/4)*3, function(){
        $("#data .title").css({"left": -150});
        $("#data .title").animate({"left": 25, "opacity": 1}, transitionSpeed/5);
    });

    $("#data .description").animate({"left": imageWidth, "opacity": 0}, (transitionSpeed/5)*4, function(){
        $("#data .description").css({"left": -150});
        $("#data .description").animate({"left": 25, "opacity": 1}, transitionSpeed/4);
    });

    $("#data .title").text(photos[current].title);
    $("#data .description").text(photos[current].desc);
}

function changeImageOrder() {
    $("#rail .image:last").after($("#rail .image:first"));
    $("#rail").css({'margin-left': "0"});
}

$("#slideshow").mouseover(function () {
    stopTimer();
    $("#overlay").stop().animate({
        'opacity': '0.4'
    }, 500);
});

$("#slideshow").mouseout(function () {
    startTimer();
    $("#overlay").stop().animate({
        'opacity': '1'
    }, 500);
});

getPicturesData();
