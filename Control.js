/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define(['./Circle',
        './Cylinder',
        './LayerManager',
        './EQPolygon',
        './EQPlacemark',
        './USGS',
        './worldwindlib',
        './AnnotationController',
        './Point',
        './Rectangle',
        './TectonicPlateLayer',
        './WorldPoint',
        './Draw',
        './MetadataDisplay'],
    function (Circle,
              Cylinder,
              LayerManager,
              EQPolygon,
              EQPlacemark,
              USGS,
              WorldWind,
              AnnotationController,
              Point,
              Rectangle,
              TectonicPlateLayer,
              WorldPoint,
              Draw,
              Metadata) {

        "use strict";

        // WorldWind Canvas
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");
        // Enable sub-surface rendering for the World Window.
        wwd.subsurfaceMode = true;
        // Enable deep picking in order to detect the sub-surface shapes.
        wwd.deepPicking = true;
        // Make the surface semi-transparent in order to see the sub-surface shapes.
        wwd.surfaceOpacity = 0.5;

        wwd.navigator.lookAtLocation.altitude = 0;
        wwd.navigator.range = 2e7;
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(function (location) {
        //         wwd.navigator.lookAtLocation.latitude = location.coords.latitude;
        //         wwd.navigator.lookAtLocation.longitude = location.coords.longitude;
        //     });
        // }

        var Control = function () {
            var earthquakes =  new USGS(wwd, this);
            var metadata = new Metadata(this);
            this.handler = new Draw(wwd, metadata, this);
            this.goToAnimator = new WorldWind.GoToAnimator(wwd);
            var Opacity = 0.5;

            this.setDrawMode = function (value) {
                this.drawMode = value;
            };

            this.setColoringMode = function (value) {
                this.coloringMode = value;
            };

            var UIController = new AnnotationController(wwd, earthquakes.parameters, this);

            this.redraw = function () {
                this.handler.startSpin();
                layerManger.synchronizeLayerList();
                earthquakes.redraw(this.handler);
            };

            this.endRedraw = function () {
                this.handler.stopSpin();
                layerManger.synchronizeLayerList();
            };

            this.reset = function () {
                this.handler.reset();
                this.redraw();
            };

            this.getOpacity = function () {
                return this.Opacity;
            };

            this.setOpacity = function (value) {
                this.Opacity = value;
                wwd.surfaceOpacity = this.Opacity;
            };

            this.FancyLookAt = function(coordinatesString) {
                var Latitude = parseFloat((coordinatesString.split(",")[0]));
                var Longitude = parseFloat((coordinatesString.split(",")[1]));
                var coords = new WorldWind.Location(Latitude, Longitude);
                this.goToAnimator.goTo(coords, null);
            };

            this.currentGeoJSON = null;

            this.CurGeoJSON = function(GeoJSON) {
                this.currentGeoJSON = GeoJSON;
            };

            this.mostRecentSigEQ = function(GeoJSON) {
                var eqArray = [];
                for (var i = 0; i < GeoJSON.features.length; i++) {
                    if (GeoJSON.features[i].properties.mag > 4.5) {
                        eqArray.push(GeoJSON.features[i]);
                    }
                }
                eqArray.sort(function(a, b) {
                    return parseFloat(b.properties.time) - parseFloat(a.properties.time);
                });
                var initevent = (eqArray[0].geometry.coordinates[1].toString() + "," + eqArray[0].geometry.coordinates[0].toString());
                var Latitude = parseFloat((initevent.split(",")[0]));
                var Longitude = parseFloat((initevent.split(",")[1]));
                var coords2 = new WorldWind.Location(Latitude, Longitude);
                wwd.navigator.lookAtLocation = coords2;
                this.tourMetadataDisplay(eqArray, 0);
            };

            this.tourMetadataDisplay = function(array, index) {
                metadata.setMagnitude(array[index].properties.mag);
                metadata.setlocation(array[index].properties.place);
                metadata.settime(new Date(array[index].properties.time));
                metadata.setlatitude(array[index].geometry.coordinates[1]);
                metadata.setlongitude(array[index].geometry.coordinates[0]);
                metadata.setdepth(array[index].geometry.coordinates[2]);
            };

            this.initializeHandlers = function () {
                // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
                wwd.addEventListener("mousemove", myControl.handler.Pick);

                // Listen for taps on mobile devices and highlight the placemarks that the user taps.
                var tapRecognizer = new WorldWind.TapRecognizer(wwd, myControl.handler.Pick);

                // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
                wwd.addEventListener("dblclick", myControl.handler.Click);
                wwd.addEventListener("mousemove", myControl.handler.Drawer);
            };

        };

        var viewControlsLayer = new WorldWind.ViewControlsLayer(wwd);
        viewControlsLayer.alignment = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.25, WorldWind.OFFSET_FRACTION, 0);
        viewControlsLayer.placement = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.25, WorldWind.OFFSET_FRACTION, 0);

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: false},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: viewControlsLayer, enabled: true},
            // {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
            {layer: new TectonicPlateLayer(), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var myControl  = new Control();
        // Layer Manager
        var layerManger = new LayerManager(wwd);

        myControl.redraw();

    });
