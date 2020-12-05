// require('./bootstrap');
window.$ = require('jquery');
// export function Course(ciao) {
//   var id = '123';
//   var name = 'davit';
//   return id + name + 'ciao= ' + ciao;
// };

export function searchOnMapSlider(lat, lng, slider){



var APPLICATION_ID = 'Y49WMBJIFT';
var SEARCH_ONLY_API_KEY = '63b572a22a729de27551ac2f07780053';
var INDEX_NAME = 'apartments';
var PARAMS = {hitsPerPage: 60};

// Client + Helper initialization
var algolia = algoliasearch(APPLICATION_ID, SEARCH_ONLY_API_KEY);
var algoliaHelper = algoliasearchHelper(algolia, INDEX_NAME, PARAMS);
algoliaHelper.setQueryParameter('getRankingInfo', true);

// DOM and Templates binding
var $map = $('#mapApiGoogle');
var $hits = $('#hits');
var $searchInput = $('#search-input');
var hitsTemplate = Hogan.compile($('#hits-template').text());
var noResultsTemplate = Hogan.compile($('#no-results-template').text());

// Map initialization
var map = new google.maps.Map($map.get(0), {
  streetViewControl: false,
  mapTypeControl: false,
  zoom: 4,
  minZoom: 3,
  maxZoom: 12,
  // center: { lat: 43.6158, lng: 13.5189 },
  // mapTypeId: "terrain",
  styles: [{stylers: [{hue: '#3596D2'}]}]
});
var fitMapToMarkersAutomatically = true;
var markers = [];
var boundingBox;
var boundingBoxListeners = [];

// Page states
var PAGE_STATES = {
  LOAD: 0,
  BOUNDING_BOX_RECTANGLE: 1,
  BOUNDING_BOX_POLYGON: 2,
  AROUND_IP: 4,
  AROUND_NYC: 5,
  AROUND_LONDON: 6,
  AROUND_SYDNEY: 7
};
var pageState = PAGE_STATES.LOAD;
setPageState(PAGE_STATES.BOUNDING_BOX_RECTANGLE);

// PAGE STATES
// ===========
function setPageState(state) {
  resetPageState();
  beginPageState(state);
}

function beginPageState(state) {
  pageState = state;

  switch (state) {

    case PAGE_STATES.BOUNDING_BOX_RECTANGLE:
      boundingBox = new google.maps.Circle({
        // bounds: {north: 60, south: 40, east: 16, west: -4},
        strokeColor: '#EF5362',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#EF5362',
        fillOpacity: 0.15,
        // draggable: true,
        // editable: true,
        geodesic: true,
        map: map,
        // center: { lat: parseFloat($('#latlatlat').val()), lng: ltlg['lng'] }, // parseFloatit ighebs value-s
        center: { lat: parseFloat(lat), lng: parseFloat(lng) },
        // center: { lat: ltlgAR[0], lng: ltlgAR[1] },
        radius:parseFloat(slider), //20 km --> bisogna sostituire con valore default di slider
      });

      // boundingBox.addListener('dragend', function(e){
      //  console.log('circle drag listener');
      // });
      // google.maps.event.addListener(map, 'dragend', function() { alert('map dragged'); } );
      // google.maps.event.addListener(marker, 'dragend', function() { alert('marker dragged'); } );

      google.maps.event.addListener(boundingBox, 'radius_changed', function () {
        console.log(boundingBox.getRadius(),'my radius from google');
        var getEditableRadius = boundingBox.getRadius();

        // mi serve search di algolia -> funziona con import? da trovare la soluzione migliore
        function setMySliderRadius() {
          let sliderForApi = $("#mySliderRadius");
          let outputForApi = $("#sliderValue");
          outputForApi.html('');
          let myKms = getEditableRadius/1000;
          outputForApi.append(myKms.toFixed(2));
          sliderForApi.val(getEditableRadius);


          // var algolia = algoliasearch(APPLICATION_ID, SEARCH_ONLY_API_KEY);
          // var algoliaHelper = algoliasearchHelper(algolia, INDEX_NAME, PARAMS);


          // const algoliasearch = require('algoliasearch');
          //
          // const client = algoliasearch('C50JGFH5DN', '4301d4422ac7e4fff78b3a9db7965ffc');
          // const index = client.initIndex('apartments');

          // index.search('', {
          //   aroundLatLng: [parseFloat(lat) , parseFloat(lng)],
          //   // aroundLatLng: [41.9 , 12.5 ],
          //   aroundRadius: getEditableRadius,
          //   hitsPerPage: 20
          // }).then(({ hits }) => {
          //   printData(hits);
          // });

        }
        setMySliderRadius();

      });

      // console.log(boundingBox.radius,'myradius');
      //
      // console.log(slider,'apsdjapsodjaspdojaspdojaspdojaspodj');

      algoliaHelper.setQueryParameter('insideBoundingBox', rectangleToAlgoliaParams(boundingBox));
      boundingBoxListeners.push(google.maps.event.addListener(
        boundingBox,
        'bounds_changed',
        throttle(rectangleBoundsChanged, 150)
      ));
      break;


  }

  fitMapToMarkersAutomatically = true;
  algoliaHelper.search();
}

function resetPageState() {
  if (boundingBox) boundingBox.setMap(null);
  for (var i = 0; i < boundingBoxListeners.length; ++i) {
    google.maps.event.removeListener(boundingBoxListeners[i]);
  }
  boundingBoxListeners = [];
  $searchInput.val('');
  algoliaHelper.setQuery('');
  algoliaHelper.setQueryParameter('insideBoundingBox', undefined);
  algoliaHelper.setQueryParameter('insidePolygon', undefined);
  algoliaHelper.setQueryParameter('aroundLatLng', undefined);
  algoliaHelper.setQueryParameter('aroundLatLngViaIP', undefined);
}

// TEXTUAL SEARCH
// ===============
$searchInput.on('input propertychange', function (e) {
  var query = e.currentTarget.value;
  if (pageState === PAGE_STATES.BOUNDING_BOX_RECTANGLE || pageState === PAGE_STATES.BOUNDING_BOX_POLYGON) {
    fitMapToMarkersAutomatically = false;
  }
  algoliaHelper.setQuery(query).search();
});

// DISPLAY RESULTS
// ===============
algoliaHelper.on('result', function (content) {
  renderMap(content);
  renderHits(content);
});

algoliaHelper.on('error', function (error) {
  console.log(error);
});

function renderHits(content) {
  if (content.hits.length === 0) {
    $hits.html(noResultsTemplate.render());
    return;
  }
  content.hits = content.hits.slice(0, 20);


  console.log(content.hits,'content hits');



  for (var i = 0; i < content.hits.length; ++i) {
    var hit = content.hits[i];
    hit.displayCity = (hit.name === hit.city);
    if (hit._rankingInfo.matchedGeoLocation) {
      hit.distance = parseInt(hit._rankingInfo.matchedGeoLocation.distance / 1000, 10) + ' km';
    }
  }
  $hits.html(hitsTemplate.render(content));
}

function renderMap(content) {
  removeMarkersFromMap();
  markers = [];

  for (var i = 0; i < content.hits.length; ++i) {
    var hit = content.hits[i];
    var marker = new google.maps.Marker({
      position: {lat: hit._geoloc.lat, lng: hit._geoloc.lng},
      map: map,
      airport_id: hit.objectID,
      title: hit.name + ' - ' + hit.city + ' - ' + hit.country
    });

    // QUI DEVO FILTRARE I MARKER RISPETTO AI FILTRI


    markers.push(marker);

    attachInfoWindow(marker, hit);
  }
  // console.log(markers,'markersmymy');

  if (fitMapToMarkersAutomatically) fitMapToMarkers();
}

// EVENTS BINDING
// ==============
$('.change_page_state').on('click', function (e) {
  e.preventDefault();
  updateMenu($(this).data('state'), $(this).data('mode'));
  switch ($(this).data('state')) {
    case 'rectangle':
      setPageState(PAGE_STATES.BOUNDING_BOX_RECTANGLE);
      break;
    case 'polygon':
      setPageState(PAGE_STATES.BOUNDING_BOX_POLYGON);
      break;
    case 'ip':
      setPageState(PAGE_STATES.AROUND_IP);
      break;
    case 'nyc':
      setPageState(PAGE_STATES.AROUND_NYC);
      break;
    case 'london':
      setPageState(PAGE_STATES.AROUND_LONDON);
      break;
    case 'sydney':
      setPageState(PAGE_STATES.AROUND_SYDNEY);
      break;
    default:
      // No op
  }
});

// HELPER METHODS
// ==============
function updateMenu(stateClass, modeClass) {
  $('.change_page_state').removeClass('active');
  $('.change_page_state[data-state="' + stateClass + '"]').addClass('active');
  $('.page_mode').removeClass('active');
  $('.page_mode[data-mode="' + modeClass + '"]').addClass('active');
}

function fitMapToMarkers() {
  var mapBounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    mapBounds.extend(markers[i].getPosition());
  }
  map.fitBounds(mapBounds);
}

function removeMarkersFromMap() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

function rectangleBoundsChanged() {
  fitMapToMarkersAutomatically = false;
  algoliaHelper.setQueryParameter('insideBoundingBox', rectangleToAlgoliaParams(boundingBox)).search();
}
function polygonBoundsChanged() {
  fitMapToMarkersAutomatically = false;
  algoliaHelper.setQueryParameter('insidePolygon', polygonsToAlgoliaParams(boundingBox)).search();
}

function rectangleToAlgoliaParams(rectangle) {
  var bounds = rectangle.getBounds();
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();
  return [ne.lat(), ne.lng(), sw.lat(), sw.lng()].join();
}

// function polygonsToAlgoliaParams(polygons) {
//   var points = [];
//   polygons.getPaths().forEach(function (path) {
//     path.getArray().forEach(function (latLng) {
//       points.push(latLng.lat());
//       points.push(latLng.lng());
//     });
//   });
//   return points.join();
// }

function attachInfoWindow(marker, hit) {
  var message;

  if (hit.name === hit.city) {
    message = hit.name + ' - ' + hit.country;
  } else {
    message = hit.name + ' - ' + hit.city + ' - ' + hit.country;
  }

  var infowindow = new google.maps.InfoWindow({content: message});
  marker.addListener('click', function () {
    setTimeout(function () {infowindow.close();}, 3000);
  });
}

function throttle(func, wait) {
  var context;
  var args;
  var result;
  var timeout = null;
  var previous = 0;
  function later() {
    previous = Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  }
  return function () {
    var now = Date.now();
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}
// });

}
