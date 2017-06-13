var url = "https://www.skrzypczyk.fr/slideshow.php";

// -----------
var timer = null;
var photos = [];

function stopTimer(){
    clearInterval(timer);
}

function startTimer(){
    timer = setInterval(moveNext, 2000);
}

function moveNext(){
    var imageWidth = $("img").width();
    $("#rail").animate({"margin-left": -imageWidth}, 750, changeImageOrder);
}

function changeImageOrder(){
    $("#rail img:last").after($("#rail img:first"));
    $("#rail").css({'margin-left': "0"});
}

function loadPictures(){

    $.getJSON(url, function(data){
        photos = data;

        $.each(photos, function(key, value){
            if(value.title != 'La pierre'){
                addPicture(value);
            }
        })

    }, function(){
        alert('ERREUR'); // TODO
    });

}

function addPicture(data){
    var image = $('<img />', {
        src: data.url,
        alt: data.desc,
        style: 'opacity:0.5'
    });

    image.css({
        'opacity':0
    });

    $("#rail").append(image);

    $("#slideshow #rail img:first").on('load', function(){
        $(image).animate({'opacity':'1'}, 1500);
        $("#loading").remove();
        $("#data .title").text(photos[0].title);
        $("#data .description").text(photos[0].desc);

        // TODO set events here (only once)
    })
}

$("#slideshow").mouseover(function(){
    stopTimer();
    $("#overlay").stop().animate({
        'opacity':'0.4'
    }, 500);
});

$("#slideshow").mouseout(function(){
    console.log('test');
    startTimer();
    $("#overlay").stop().animate({
        'opacity':'1'
    }, 500);
});

loadPictures();
