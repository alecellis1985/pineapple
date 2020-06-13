var marker;
var marker2;
var map;
function initMap() {
    map = new google.maps.Map(document.querySelector('#map'), {
        center: { lat: -34.892075, lng: -56.091937 },
        zoom: 13,
        disableDefaultUI: true
    });

    initZoomControl(map);
    initMapTypeControl(map);
    initFullscreenControl(map);
    initzoomControlBack(map);

    var contentString = '<div id="content" style="width: 150px">' +
        '<p class="firstHeading"><img  src="app/img/pineappleLogo.png" width="56" alt="pineapple lab"></p></br>' +
        '<div class="address clearfix">' +
        '<h3><i class="fa fa-map-marker titleAdress"></i>Address:</h3>' +
        '<span>Pilcomayo 5408 Apto 104, Esq Fleming</br>Montevideo, Uruguay, 11400.</span>' +
        '</div></br>' +
        '<div class="phone clearfix">' +
        '<h3><i class="fa fa-phone titleAdress"></i>Phone:</h3>' +
        '<span>+59898635923</span>' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var contentString2 = '<div id="content" style="width: 150px">' +
        '<p class="firstHeading"><img  src="app/img/pineappleLogo.png" width="56" alt="pineapple lab"></p></br>' +
        '<div class="address clearfix">' +
        '<h3><i class="fa fa-map-marker titleAdress"></i>Address:</h3>' +
        '<span>Alberdi 6248, Esq Dublin</br>Montevideo, Uruguay, 11500.</span>' +
        '</div></br>' +
        '<div class="phone clearfix">' +
        '<h3><i class="fa fa-phone titleAdress"></i>Phone:</h3>' +
        '<span>+59898635923</span>' +
        '</div>';

    var infowindow2 = new google.maps.InfoWindow({
        content: contentString2
    });

    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: { lat: -34.892075, lng: -56.091937 }

    });

    marker2 = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: { lat: -34.882327, lng: -56.072614 }
    });

    marker.addListener('mouseover', function () {
        infowindow.open(map, marker);
        infowindow2.close(map, marker2);
    });

    marker.addListener('click', function () {
        map.setZoom(16);
        map.setCenter(marker.getPosition());
        toggleBounce();
    });

    marker2.addListener('mouseover', function () {
        infowindow2.open(map, marker2);
        infowindow.close(map, marker);
    });

    marker2.addListener('click', function () {
        map.setZoom(16);
        map.setCenter(marker2.getPosition());
        toggleBounce();
    });
}

function initzoomControlBack(map) {
    document.querySelector('.zoom-control-back').onclick = function () {
        map.setZoom(12);
    };
}

function toggleBounce() {
    if (marker2.getAnimation() !== null) {
        marker.setAnimation(null);
        marker2.setAnimation(null);
        // marker3.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        marker2.setAnimation(google.maps.Animation.BOUNCE);
        // marker3.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function initZoomControl(map) {
    document.querySelector('.zoom-control-in').onclick = function () {
        map.setZoom(map.getZoom() + 1);
    };
    document.querySelector('.zoom-control-out').onclick = function () {
        map.setZoom(map.getZoom() - 1);
    };
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        document.querySelector('.zoom-control'));
}

function initMapTypeControl(map) {
    var mapTypeControlDiv = document.querySelector('.maptype-control');
    document.querySelector('.maptype-control-map').onclick = function () {
        mapTypeControlDiv.classList.add('maptype-control-is-map');
        mapTypeControlDiv.classList.remove('maptype-control-is-satellite');
        map.setMapTypeId('roadmap');
    };
    document.querySelector('.maptype-control-satellite').onclick =
        function () {
            mapTypeControlDiv.classList.remove('maptype-control-is-map');
            mapTypeControlDiv.classList.add('maptype-control-is-satellite');
            map.setMapTypeId('hybrid');
        };

    map.controls[google.maps.ControlPosition.LEFT_TOP].push(
        mapTypeControlDiv);
}

function initFullscreenControl(map) {
    var elementToSendFullscreen = map.getDiv().firstChild;
    var fullscreenControl = document.querySelector('.fullscreen-control');
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
        fullscreenControl);


    fullscreenControl.onclick = function () {
        if (isFullscreen(elementToSendFullscreen)) {
            exitFullscreen();
        } else {
            requestFullscreen(elementToSendFullscreen);
        }
    };

    document.onwebkitfullscreenchange =
        document.onmsfullscreenchange =
        document.onmozfullscreenchange =
        document.onfullscreenchange = function () {
            if (isFullscreen(elementToSendFullscreen)) {
                fullscreenControl.classList.add('is-fullscreen');
            } else {
                fullscreenControl.classList.remove('is-fullscreen');
            }
        };
}

function isFullscreen(element) {
    return (document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement) == element;
}
function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullScreen) {
        element.msRequestFullScreen();
    }
}
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msCancelFullScreen) {
        document.msCancelFullScreen();
    }
}