<!-- Define custom marker colors -->
var greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var orangeIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


function setFeed(feed_data, mymap) {
    var update_feed = L.control({position: 'topright'});
    update_feed.onAdd = function(mymap){
        var div = L.DomUtil.create('div', 'gb-update-feed-div');
        div.innerHTML= '<div class="gb-map-overlay">'
                        + '<div class="gb-panel gb-panel-default">'
                        + '<div class="gb-panel-heading"><h4>GBA Updates</h4></div>'
                        + '<div class="gb-panel-body">'
                        + '<ul><li>' + feed_data[0].name + feed_data[0].action + feed_data[0].modified + '</li>'
                        + '<li>' + feed_data[1].name + feed_data[1].action + feed_data[1].modified + '</li>'
                        + '<li>' + feed_data[2].name + feed_data[2].action + feed_data[2].modified + '</li>'
                        + '<li>' + feed_data[3].name + feed_data[3].action + feed_data[3].modified + '</li>'
                        + '<li>' + feed_data[4].name + feed_data[4].action + feed_data[4].modified + '</li>'
                        + '</ul>'
                        + '</div>'
                        + '</div>'
                        + '</div>';
        return div;
    }
    update_feed.addTo(mymap);
}


function populateMap(organizations, mymap, show_details_btn) {
    var markerArray = [];
    var marker, i;
    var html;

    if (organizations.length <= 0 || organizations == null) {
        <!-- Fail gracefully (hide map div on failure -->
        $('#gb-map').hide()
    }
    else {
        for (i = 0; i < organizations.length; i++) {
            if (organizations[i].latitude !== "undefined" && organizations[i].latitude !== null && organizations[i].longitude !== "undefined" && organizations[i].longitude !== null) {
                <!-- Determine if the current org is a GBA member and set HTML accordingly -->
                var gb_member_status_html;
                var gb_member_status = organizations[i].display_GBA_alliance_membership_status;
                if (gb_member_status == "Participating Member") {
                    gb_member_status_html = "<span class='map-label map-label-success'>Participating Member</span>";
                }
                else if (gb_member_status == "Sponsor Member") {
                    gb_member_status_html = "<span class='map-label map-label-info'>Sponsor Member</span>";
                }
                else {
                    gb_member_status_html = "<span class='map-label map-label-default'>" + gb_member_status + "</span>";
                }

                <!-- Determine the type of organization -->
                var gb_member_type_html;
                var gb_custodian_count = organizations[i].custodian_count;
                var gb_app_count = organizations[i].app_count;
                var gb_marker_color = null;

                if (gb_custodian_count == 0 && gb_app_count > 0) {
                    gb_member_type_html = "<span class='map-label map-label-warning'>3rd Party Developer</span>";
                    gb_marker_color = "Orange";
                }
                else {
                    gb_member_type_html = "<span class='map-label map-label-success'>Data Custodian</span>";
                    gb_marker_color = "Green";
                }

                html = '<div class="map-img-with-title"><img src="' + organizations[i].organization_thumbnail + '"/>'
                        + '<h4>' + organizations[i].name + '</h4></div>'
                        + '<ul><li>' + organizations[i].contact_email +'</li>'
                        + ( typeof gb_app_count  !== "undefined" && gb_app_count > 0 ?  "<li>Number of apps: " + gb_app_count + "</li>": "" )
                        + ( typeof gb_custodian_count  !== "undefined" && gb_custodian_count > 0 ?  "<li>Number of custodians: " + gb_custodian_count + "</li>": "" )
                        + '</ul><div class="map-label-divs">' + gb_member_status_html + gb_member_type_html + '</div>'
                        + ( typeof show_details_btn !== "undefined" && show_details_btn == true ?  '<hr class="map-hr"> <a type="button" href="' + organizations[i].marketplace_url + '" class="map-btn map-btn-primary btn-block">More info</a>': "" )

              var popup = L.responsivePopup().setContent(html);

              if (gb_marker_color == "Orange") {
                marker = L.marker([organizations[i].latitude, organizations[i].longitude], {icon: orangeIcon}).addTo(mymap).bindPopup(popup);
              }
              else {
                marker = L.marker([organizations[i].latitude, organizations[i].longitude], {icon: greenIcon}).addTo(mymap).bindPopup(popup);
              }

              markerArray.push(marker);
          }
        }

        <!-- Change map bounds to fit all markers -->
        var group = L.featureGroup(markerArray); //add markers array to featureGroup
        mymap.fitBounds(group.getBounds());
    }
}


function initGBMap(token, show_details_btn, display_feed) {

    if(token == null) {
        console.log("Please provide a valid token from the Green Button Directory Service");
        $('#gb-map').hide()
        return;
    }

    if (show_details_btn == null) {
        show_details_btn = true;
    }

    if (display_feed == null) {
        display_feed = true;
    }

    var mymap = L.map('gb-map', {scrollWheelZoom: false});

    L.tileLayer('https://api.mapbox.com/styles/v1/jancsarc/cj4pp0vd1asq42st6acdijnpf/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamFuY3NhcmMiLCJhIjoiY2o0cG56cHgxMDNiZzJxbjBva213NWpzZSJ9.ggdOCnx7LPbI1sxjNFmf-A', {
        maxZoom: 18,
        noWrap: true,
        id: 'mapbox.streets',
        continuousWorld: false,
        maxBoundsViscosity: 1.0,
        bounds: [[-90, -180],[90, 180]],

        accessToken: 'pk.eyJ1IjoiamFuY3NhcmMiLCJhIjoiY2o0cG56cHgxMDNiZzJxbjBva213NWpzZSJ9.ggdOCnx7LPbI1sxjNFmf-A'
    }).addTo(mymap);

    <!-- Add a legend to the map -->
    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function (mymap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = [];

        // Generate a label with a colored square for each member type
        div.innerHTML = '<i style="background: #cb8429;"></i> '
                        + '3rd Party Developers<br>'
                        + '<i style="background: #22ac1f;"></i> '
                        + 'Data custodians<br>'

        return div;
    };

    legend.addTo(mymap);

    // Remove the attribution info for the graph.
    mymap.attributionControl.setPrefix('');

    <!-- On page load plot the organizations on the map -->
    $.ajax({
        url: '/api/current/organizations/?format=json',
        method: "GET",
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Token " + token);
        },
        success: function (data) {
            populateMap(data, mymap, show_details_btn)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            <!-- Fail gracefully (hide map div on failure -->
            $('#gb-map').hide()
        }
    });

    if (display_feed == true) {
        $.ajax({
            url: '/hidden-api/update-feed/',
            method: "GET",
            dataType: "json",
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            cache: false,
            beforeSend: function (xhr) {
                /* Authorization header */
                xhr.setRequestHeader("Authorization", "Token " + token);
            },
            success: function (data) {
                setFeed(data, mymap);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                <!-- Fail gracefully (hide org feed on error -->
                $('.gb-update-feed-div').hide()
            }
        });
    }
}