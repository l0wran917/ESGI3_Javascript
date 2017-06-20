var imgLink = 'https://static.pexels.com/photos/292600/pexels-photo-292600.jpeg';
var imgLinkOpti = 'https://api.kraken.io/v1/upload';

var params = {
    "auth": {
        "api_key": "64a4f0042aa5b2f0f42beca15f442012",
        "api_secret": "eeea96bf310db04e24f8c871a3221e5f4e18c21d"
    },
    "url": imgLink,
    "wait": true
};

$.ajax({
    type: "post",
    url: imgLinkOpti,
    crossDomain: true,
    contentType: 'application/json',
    data: JSON.stringify(params),
    success: function (data) {
        console.log(data);
    },
    error: function(data, test, ok){
        console.log(data);
        console.log(test);
        console.log(ok);
    }
});
