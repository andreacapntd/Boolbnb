window.$ = require('jquery');

function search(){

   var places = require('places.js');
   var placesAutocomplete = places({
     appId: 'pl3L0GWSSXDR',
     apiKey: '2e3513be338d19d42a81830c543b4aa8',
     container: document.querySelector('#mysearch')
   });
   placesAutocomplete.on('change', function select(e) {
   var latlng = e.suggestion.latlng;
   var lat = latlng.lat;
   var lng = latlng.lng;

   $('#lat-form').val(lat);
   $('#lng-form').val(lng);
 });

}

function init() {
  search();
}

$(document).ready(init)
