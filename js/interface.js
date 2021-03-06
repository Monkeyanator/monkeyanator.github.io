$(document).ready(function(){

  //S A D B O Y S
  $(document).on('click', '.debris-list-element', onDebrisListElementClick);

  //hide card on submit, show when report debris is pressed
  //toggle when pressing report debris
  $("#report-debris-button").click(() => {
    if($("#pac-card").is(":visible")){
      $("#pac-card").hide();
    } else{
      $("#pac-card").show();
    }
  });
  // if we cancel the btn, we reset all values to default and we hide
  $("#form-btn-cancel").click(() => {
    $("#pac-card").hide();
    $("#debris-form-title").val("");
    $("#debris-form-description").val("");
    $("#debris-form-location").val(null);
  });

  $('#btn-get-geo').click(() => {
    geoLocate();
  });


  //set up events for resolving debris submission
  $("#resolve-debris-submit").click(() => {

    var name = $("#resolve-debris-name").val();
    var email = $("#resolve-debris-email").val();
    var phone = $("#resolve-debris-phone_number").val();
    var organization = $("#resolve-debris-organization").val();
    var plan = $("#resolve-debris-plan").val();
    var date = $("#resolve-debris-datepicker").val();
    // console.log(name);
    // console.log(email);
    // console.log(phone);
    // console.log(organization);
    // console.log(plan);
    // console.log(date);
    if (name == "" || email == "" || phone == "" || plan == "" || date == ""){
      Materialize.toast('Please complete the form', 4000, 'rounded');
    }
    else {
      var formData = {name: name, email: email, phone: phone, date: date};

      //change current marker color
      window.currentMarker.setIcon(window.YELLOW_MARKER_URL);
      debrisResolveSubmitFormToData(window.currentMarker, formData);
      $('.bottom-sheet').modal('close');
      Materialize.toast('Debris Resolved', 4000, 'rounded');

      //reset form to empty
      $("#resolve-debris-name").val('');
      $("#resolve-debris-email").val('');
      $("#resolve-debris-phone_number").val('');
      $("#resolve-debris-organization").val('');
      $("#resolve-debris-plan").val('');
      $("#resolve-debris-datepicker").val('');
    }
  });

  // set up events for form submission
  $("#form-btn-submit").click(() => {
    var geocoder = new google.maps.Geocoder();
    var address = $("#debris-form-location").val();
    var title = $("#debris-form-title").val();
    var description = $("#debris-form-description").val();

    if (title == "" || description == "" || address == {}){
      Materialize.toast("Please fill out the form!", 4000,"rounded")
      return;
    }

    geocoder.geocode({'address': address}, function(results, status) {
      if (status == 'OK') {
        //grab the location
        var location = results[0].geometry.location;
        var lat = location.lat();
        var lng = location.lng();

        //intialize marker data
        var newMarker = {};
        newMarker.location = {};
        newMarker.location.lat = lat;
        newMarker.location.lng = lng;
        newMarker.title = title;
        newMarker.description = description;
        newMarker.markerUrl = "http://probalrashid.com/wp-content/uploads/2015/05/IMG_7184.jpg";

        var markerRef = addMarkerToMapInstance(window.map, newMarker);
        newMarker.markerReference = markerRef;

        markers.push(newMarker);
        addMarkerDataToList(newMarker);

        console.log(markers);

        //reset form to empty
        $("#debris-form-title").val("");
        $("#debris-form-description").val("");
        $("#debris-form-location").val(null);

        // Materialize.toast(message, displayLength, className, completeCallback);
        $("#pac-card").hide();
        Materialize.toast('Debris reported!', 4000, 'rounded'); // 4000 is the duration of the toast

      }
      else if (status == "INVALID_REQUEST" || status == "ZERO_RESULTS"){
        Materialize.toast("Please enter a valid address!", 4000,"rounded");
      }

      else {
        Materialize.toast('Geocode was not successful for the following reason: '+ status, 4000, 'rounded');
      }
    });

  });

});

function onDebrisListElementClick(){
  var articleTitle = $(this).attr('id');
  var results = markers.filter(function(element){
    return element.title == articleTitle;
  });

  var resultElement = results[0];
  var resultMarkerRef = resultElement.markerReference;

  window.currentMarker = resultMarkerRef;
  window.map.setCenter(resultMarkerRef.position);

  var infoWindow = new google.maps.InfoWindow({
    content: resultMarkerRef.content,
    maxWidth: 200
  });

  clearInfoWindows();
  infoWindow.open(resultMarkerRef.getMap(), resultMarkerRef);

  window.previousInfoWindow = infoWindow;

  // Hide sideNav
  $('.button-collapse').sideNav('hide');
}
