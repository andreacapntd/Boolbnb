
window.$ = require('jquery');

import { searchOnMap } from './mapApi.js';
import { searchOnMapSlider } from './mapApiSlider.js';
import { searchOnMapSliderChecked } from './mapApiSliderChecked.js';

  function search(){


   var places = require('places.js');
   var placesAutocomplete = places({
     appId: 'pl3L0GWSSXDR',
     apiKey: '2e3513be338d19d42a81830c543b4aa8',
     container: document.querySelector('#mysearch')
   });

        placesAutocomplete.on('change', function select(e) {


          $('#wifiCheck').val(0);
          $('#saunaCheck').val(0);
          $('#parkingCheck').val(0);
          $('#seaCheck').val(0);
          $('#poolCheck').val(0);
          $('#receptionCheck').val(0);


          $('#wifiCheck').prop('checked', false);
          $('#saunaCheck').prop('checked', false);
          $('#parkingCheck').prop('checked', false);
          $('#seaCheck').prop('checked', false);
          $('#poolCheck').prop('checked', false);
          $('#receptionCheck').prop('checked', false);
          $("#mySliderRadius").val(20000);
          $('#sliderValue').text('');
        var latlng = e.suggestion.latlng;
        var lat = latlng.lat;
        var lng = latlng.lng;
        getData(lat,lng);
        sliderRadius(lat,lng);
        optionListener(lat,lng);

      });

  }
// selezioni aggiuntive
  function selectMinRoomsBeds(lat,lng) {
    var me = $(this);
    var isSelected = me.is('selected');

    const algoliasearch = require('algoliasearch');

    const client = algoliasearch('Y49WMBJIFT', '63b572a22a729de27551ac2f07780053');
    const index = client.initIndex('apartments');
    // if($('#address').val()){

      index.setSettings({
      attributesForFaceting: [
        'services', // or 'filterOnly(categories)' for filtering purposes only
      ]
      }).then(() => {
      // done
      });

      index.search('', {
        aroundLatLng: [parseFloat(lat) , parseFloat(lng)],
        aroundRadius: $("#mySliderRadius").val(),
        filters:'services:'+ $('#saunaCheck').val() + ' AND services: ' + $('#wifiCheck').val() + ' AND services: ' + $('#parkingCheck').val() + ' AND services: ' + $('#seaCheck').val() + ' AND services: ' + $('#poolCheck').val() + ' AND services: ' + $('#receptionCheck').val() +
                ' AND number_of_rooms >= ' + $('#min-rooms').val() + ' AND ' +`number_of_beds >= `+ $('#min-beds').val() +
                ' AND visibility = 1',
        hitsPerPage: 20
      }).then(({ hits }) => {
        printData(hits);

        var slider = $("#mySliderRadius").val()
        searchOnMapSliderChecked(lat, lng, slider, hits);

      });

  }

  function optionListener(lat,lng) {
    var targetRoom = $('#min-rooms');
    var targetBed = $('#min-beds');
    var saunaTarget = $('#saunaCheck');
    var wifiTarget = $('#wifiCheck');
    var parkingTarget = $('#parkingCheck');
    var seaTarget = $('#seaCheck');
    var poolTarget = $('#poolCheck');
    var receptionTarget = $('#receptionCheck');

    targetRoom.change(function(){selectMinRoomsBeds(lat,lng);});
    targetBed.change(function(){selectMinRoomsBeds(lat,lng);});
    saunaTarget.change(function() {
      var me = $(this);
      var isChecked = me.is(':checked');
      if (isChecked) {
        $('#saunaCheck').val(3);
        console.log('si',$('#saunaCheck').val());
      }
      else {
          $('#saunaCheck').val(0);
        console.log('no',$('#saunaCheck').val());
      }
      selectMinRoomsBeds(lat,lng);
    });



    wifiTarget.change(function() {
      var me = $(this);
      var isChecked = me.is(':checked');
      if (isChecked) {
        $('#wifiCheck').val(1);
      }
      else {
        $('#wifiCheck').val(0);
      }
      selectMinRoomsBeds(lat,lng);
    });

    parkingTarget.change(function() {
      var me = $(this);
      var isChecked = me.is(':checked');
      if (isChecked) {
        $('#parkingCheck').val(2);
      }
      else {
        $('#parkingCheck').val(0);
      }
      selectMinRoomsBeds(lat,lng);
    });

    seaTarget.change(function() {
      var me = $(this);
      var isChecked = me.is(':checked');
      if (isChecked) {
        $('#seaCheck').val(4);
      }
      else {
        $('#seaCheck').val(0);
      }
      selectMinRoomsBeds(lat,lng);
    });

    poolTarget.change(function() {
      var me = $(this);
      var isChecked = me.is(':checked');
      if (isChecked) {
        $('#poolCheck').val(5);
      }
      else {
        $('#poolCheck').val(0);
      }
      selectMinRoomsBeds(lat,lng);
    });

    receptionTarget.change(function() {
      var me = $(this);
      var isChecked = me.is(':checked');
      if (isChecked) {
        $('#receptionCheck').val(6);
      }
      else {
        $('#receptionCheck').val(0);
      }
      selectMinRoomsBeds(lat,lng);
    });
  }

// >>>>>>> bool-search-map
// slider
function sliderRadius(lat,lng) {

      var slider = $("#mySliderRadius");
    output.append(slider.val()/1000);
    var output = $("#sliderValue");

    slider.on('change', function() {
      output.html('');
      output.append(slider.val()/1000);

      var mySliderValue = slider.val()

      const algoliasearch = require('algoliasearch');

      const client = algoliasearch('Y49WMBJIFT', '63b572a22a729de27551ac2f07780053');
      const index = client.initIndex('apartments');
      // if($('#address').val()){
        index.setSettings({
        attributesForFaceting: [
          'services', // or 'filterOnly(categories)' for filtering purposes only
                  ]
        }).then(() => {
        // done
        });

        index.search('', {
          aroundLatLng: [parseFloat(lat) , parseFloat(lng)],
          filters:'services:'+ $('#saunaCheck').val() + ' AND services: ' + $('#wifiCheck').val() + ' AND services: ' + $('#parkingCheck').val() + ' AND services: ' + $('#seaCheck').val() + ' AND services: ' + $('#poolCheck').val() + ' AND services: ' + $('#receptionCheck').val() +
                  ' AND number_of_rooms >= ' + $('#min-rooms').val() + ' AND ' +`number_of_beds >= `+ $('#min-beds').val() +
                  ' AND visibility = 1',
          aroundRadius: slider.val(),
          hitsPerPage: 20
        }).then(({ hits }) => {

          var slider = $("#mySliderRadius").val()
          searchOnMapSliderChecked(lat, lng, slider, hits);

          printData(hits);

        });


    });
}


// richiamo i dati e faccio semplice selezione con lat e lng

  function printData(hits) {


  console.log('printData');

  var handtemplate = $('#handlebar-template').html();
  var compiled = Handlebars.compile(handtemplate);
  var handtargetSpons = $('#hand-target-sponsorship');
  var handtarget = $('#hand-target');
  handtarget.text('');
  handtargetSpons.text('');
    for (var i = 0; i < hits.length; i++) {

      var hit = hits[i];
      var imgs = hit['imgs'];
      var img = imgs[0];
      hit['img'] = img;
      if (hit['sponsorship'] == 1) {
        var resultHtml = compiled(hit);

          handtargetSpons.append(resultHtml);
      }
      else {
        var resultHtml = compiled(hit);

          handtarget.append(resultHtml);
      }

    }
  }

  function getDataValue(aparts,lat,lng) {
    for (var i = 0; i < aparts.length; i++) {
      var apart = aparts[i];
      var _geoloc = {
        'lat': parseFloat(apart.lat),
        'lng': parseFloat(apart.lng)
      };
      apart._geoloc = _geoloc;

    }

    const algoliasearch = require('algoliasearch');

    const client = algoliasearch('Y49WMBJIFT', '63b572a22a729de27551ac2f07780053');
    const index = client.initIndex('apartments');

    for (var i = 0; i < aparts.length; i++) {
      var apart = aparts[i];
      apart.objectID = apart.id;

    }

    index.saveObjects(aparts).then(({ objectIDs }) => {
    index.setSettings({
    attributesForFaceting: [
      'services', // or 'filterOnly(categories)' for filtering purposes only
      'visibility'
    ]
    }).then(() => {
    // done
    });
    index.setSettings({
    attributesForFaceting: [
      'services', // or 'filterOnly(categories)' for filtering purposes only
              ]
    }).then(() => {
    // done
    });
    index.search('',{
      aroundLatLng: lat + ',' + lng,
      // aroundLatLng: '41.9, 12.5',
      aroundRadius: 20 * 1000,
      filters:'services:'+ $('#saunaCheck').val() + ' AND services: ' + $('#wifiCheck').val() + ' AND services: ' + $('#parkingCheck').val() + ' AND services: ' + $('#seaCheck').val() + ' AND services: ' + $('#poolCheck').val() + ' AND services: ' + $('#receptionCheck').val() +
              ' AND number_of_rooms >= ' + $('#min-rooms').val() + ' AND ' +`number_of_beds >= `+ $('#min-beds').val() +
              ' AND visibility = 1'
    })
    .then(({ hits }) => {
      console.log('hits',hits);
      printData(hits);
      var slider = $("#mySliderRadius").val()
      searchOnMapSliderChecked(lat, lng, slider, hits);
    });
    // getResults(aparts,lat,lng);
    });

  }

  function getData(lat,lng) {

   $.ajax({
     url:"/api/aparts",
     method:'GET',
     success: function(data,state){


       getDataValue(data,lat,lng);
     },
     error: function(err) {
       console.log('error', err);
     }
   });
 }

function init() {

  $('#wifiCheck').val(0);
  $('#saunaCheck').val(0);
  $('#parkingCheck').val(0);
  $('#seaCheck').val(0);
  $('#poolCheck').val(0);
  $('#receptionCheck').val(0);


  var lat = parseFloat($('#mylatitude').text());
  var lng = parseFloat($('#mylongitude').text());

  getData(lat,lng);

  search();
  sliderRadius(lat,lng);
  optionListener(lat,lng);
}

$(document).ready(init);
