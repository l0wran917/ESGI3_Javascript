var imgLink = 'https://static.pexels.com/photos/292600/pexels-photo-292600.jpeg';

var progressElem = $('#progressCounter');
$("#loading").hide();
progressElem.text(imgLink);


$.ajax({
    type: 'GET',
    url: imgLink,
    cache: false,
    error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.responseText);
        alert(thrownError);
    },
    xhr: function () {
        var xhr = new window.XMLHttpRequest();
        //Download progress
        xhr.addEventListener("progress", function (evt) {
            console.log(evt.lengthComputable);
            var arr = new Uint8Array(evt.currentTarget.response);
            var raw = String.fromCharCode.apply(null,arr);
console.log(raw);
            var b64=btoa(raw);
            var dataURL="data:image/jpeg;base64,"+b64;

            $("#image").attr('src', dataURL);
//            console.log(evt.currentTarget.response);
            if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                progressElem.html(Math.round(percentComplete * 100) + "%");
            }
        }, false);
        return xhr;
    },
    beforeSend: function () {
        $('#loading').show();
    },
    complete: function () {
        $("#loading").hide();
    },
    success: function (json) {
    }
});
