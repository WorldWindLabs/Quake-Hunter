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
        './MetadataDisplay',
        //'./LayersPanel',
        './DataGrid'],
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
              Metadata,
              DataGrid,
              USGSSlabs) {

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
        var layerManager = new LayerManager(wwd);
        var Control = function () {
            //this.layerManager = new LayerManager(wwd);
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
                layerManager.synchronizeLayerList();
                earthquakes.redraw(this.handler);
            };

            this.endRedraw = function () {
                this.handler.stopSpin();
                layerManager.synchronizeLayerList();
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

            // Configure the USGS earthquake slab layers.
            this.loadSlabData("Cascadia slab", "cascadia_slab1.0_clip.xyz", 401, WorldWind.Color.YELLOW);
            this.loadSlabData("Solomon slab", "sol_slab1.0_clip.xyz", 1001, WorldWind.Color.YELLOW);
            this.loadSlabData("Mexico slab", "mex_slab1.0_clip.xyz", 1251, WorldWind.Color.CYAN);
            this.loadSlabData("Aleutians slab", "alu_slab1.0_clip.xyz", 2451, WorldWind.Color.MAGENTA);

            // Establish the shapes and the controllers to handle picking.
            this.setupPicking();

        };

        Control.prototype.loadSlabData = function (name, dataFile, width, color) {
            var dataLocation = "http://worldwindserver.net/webworldwind/data/usgs/",
                url = dataLocation + dataFile;

            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var dataGrid = new DataGrid(xhr.responseText);
                        this.addGridToWorldWindow(name, dataGrid, color);
                    }
                    else {
                        Logger.log(Logger.LEVEL_WARNING,
                            "Slab data retrieval failed (" + xhr.statusText + "): " + url);
                    }
                }
            }).bind(this);

            xhr.onerror = function () {
                Logger.log(Logger.LEVEL_WARNING, "Slab data retrieval failed: " + url);
            };

            xhr.ontimeout = function () {
                Logger.log(Logger.LEVEL_WARNING, "Slab data retrieval timed out: " + url);
            };

            xhr.send(null);
        };

        Control.prototype.addGridToWorldWindow = function (name, dataGrid, color) {
            var meshLayer = new WorldWind.RenderableLayer();
            meshLayer.displayName = name;
            wwd.addLayer(meshLayer);

            var meshAttributes = new WorldWind.ShapeAttributes(null);
            meshAttributes.drawOutline = false;
            meshAttributes.outlineColor = WorldWind.Color.BLUE;
            meshAttributes.interiorColor = color;
            meshAttributes.applyLighting = true;

            var highlightAttributes = new WorldWind.ShapeAttributes(meshAttributes);
            highlightAttributes.outlineColor = WorldWind.Color.WHITE;

            var indices = dataGrid.findTriangles();
            var splitShapes = WorldWind.TriangleMesh.split(dataGrid.positions, indices, null, null);

            for (var i = 0; i < splitShapes.length; i++) {
                var mesh = new WorldWind.TriangleMesh(splitShapes[i].positions, splitShapes[i].indices, meshAttributes);
                mesh.altitudeMode = WorldWind.ABSOLUTE;
                mesh.highlightAttributes = highlightAttributes;
                mesh.dataGrid = dataGrid;
                meshLayer.enabled = false;
                meshLayer.addRenderable(mesh);
            }

            layerManager.synchronizeLayerList();
            wwd.redraw();
        };

        Control.prototype.setupPicking = function () {
            this.screenText = new WorldWind.ScreenText(new WorldWind.Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0), " ");
            this.screenText.attributes = new WorldWind.TextAttributes();
            this.screenText.attributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0);

            this.textLayer = new WorldWind.RenderableLayer();
            this.textLayer.hide = true;
            this.textLayer.enabled = false;
            this.textLayer.addRenderable(this.screenText);
            wwd.addLayer(this.textLayer);

            var handlePick = (function (o) {
                var pickPoint = wwd.canvasCoordinates(o.clientX, o.clientY);

                this.textLayer.enabled = false;
                wwd.redraw();

                var pickList = wwd.pick(pickPoint);
                if (pickList.objects.length > 0) {
                    for (var p = 0; p < pickList.objects.length; p++) {
                        var pickedObject = pickList.objects[p];
                        if (pickedObject.userObject instanceof WorldWind.TriangleMesh) {
                            if (pickedObject.position) {
                                var latitude = pickedObject.position.latitude,
                                    longitude = pickedObject.position.longitude,
                                    altitude = pickedObject.userObject.dataGrid.lookupValue(latitude, longitude);
                                if (altitude !== null) {
                                    this.screenText.screenOffset.x = pickPoint[0];
                                    this.screenText.screenOffset.y = wwd.viewport.width - pickPoint[1];
                                    this.screenText.text = Math.floor(Math.abs(altitude) / 1000).toString() + " Km";
                                    this.textLayer.enabled = true;
                                }
                            }
                        }
                    }
                }
            }).bind(this);

            // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
            wwd.addEventListener("mousemove", handlePick);

            // Listen for taps on mobile devices and highlight the placemarks that the user taps.
            var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);
        };

        var viewControlsLayer = new WorldWind.ViewControlsLayer(wwd);
        viewControlsLayer.alignment = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.25, WorldWind.OFFSET_FRACTION, 0);
        viewControlsLayer.placement = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.25, WorldWind.OFFSET_FRACTION, 0);

        //var layersPanel = new LayersPanel(wwd);

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
            //console.log(layers[l].layer.displayName);
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var myControl  = new Control();
        // Layer Manager
        //var layerManger = new LayerManager(wwd);

        myControl.redraw();

    });
