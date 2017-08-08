Green Button Directory Services - Leaflet Map
------------------------

Styling and scripts to embed a leaflet.js based map on the Green Button series of webpages.

Table of Contents
-----------------

- [Installation](#installation)
- [Options](#options)


Installation
------------

1. Include the following in at the end of the page "<head>" tag:

    ```
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.1.0/dist/leaflet.css"
   integrity="sha512-wcw6ts8Anuw10Mzh9Ytw4pylW8+NAD4ch3lqm9lzAsTxg0GFeJgoAtxuCLREZSC5lUXdVyo/7yfsqFjQ4S+aKw=="
   crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.0.2/dist/leaflet.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.2/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet-responsive-popup@0.2.0/leaflet.responsive.popup.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-responsive-popup@0.2.0/leaflet.responsive.popup.css" />
    <link rel="stylesheet" href="https://cdn.rawgit.com/jancsarc/GB-Leaflet-Org-Map/d6175cf6/static/css/gb_map_styles.min.css">
    ```

2. Add the following container where you would like to place the map on the page:
    
    ```
    <section class="mbr-section mbr-section__container article" id="header3-2" style="background-color: #191a1a; padding-top: 40px; padding-bottom: 40px;">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <h3 class="mbr-section-title display-2" id="gb-map-header">Green Button Ecosystem</h3>
                    <small class="mbr-section-subtitle">Over 65,000,000 data points and 25 members and counting...</small>
                </div>
            </div>
        </div>
    </section>
    <section id="map-section">
        <div class="gb-mapbox">
            <div id="gb-map">
                <!-- Map will be inserted here when initialized -->
            </div>
        </div>
    </section>
    ```
    
3. Add the following script file to the page (at the bottom of the header, *after jQuery is imported*, but before the script to initialize the map.):

    ```
    <script src="https://cdn.rawgit.com/jancsarc/GB-Leaflet-Org-Map/d6175cf6/static/js/gb_map_leaflet.min.js"></script>
    ```
    
4. Initialize the map (with options if required). Use the token that you recieve when signing up to the Green Button directory service:

    ```
    <script type='text/javascript'>
        initGBMap(token={{ YOUR_GB_TOKEN }}, show_details_btn=false, display_feed=false);
    </script>
    ```
   
<hr>

Options
-------

The following options can be added to the initialization function for the map:

- show_details_btn (default= true): If set to false, the 'detail' button on the popover for the map markers will not be shown, and there will be no link to the organization in the marketplace.
- display_feed (default= true):  If set to false, the 'feed' overlay on the map (that shows recent directory service changes) will not be shown.
