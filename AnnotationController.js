/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define(['./USGS', './Draw', './Control', './WorldPoint'], function(USGS, Draw, control, WorldPoint) {
    "use strict";


    var AnnotationController = function(worldWindow, queryParameters, control) {
        this.worldWindow = worldWindow;

        this.magSlider = $("#magSlider");
        this.dateSlider = $("#dateSlider");
        this.opacitySlider = $("#opacitySlider");

        // var firstTime = true;
        this.drawingSelector = $("#drawingSelection");
        var drawingSelector = this.drawingSelector;
        this.drawingSelector.on("change", function() {
            // if (firstTime) {
            //     alert("Double Click to select points");
            //     firstTime = false;
            // }
            control.setDrawMode(drawingSelector.val());
        });


        // this.drawRectangle = $("#drawRectangle").on("click", function () {
        //     control.setDrawMode("rectangle");
        // });
        //
        // this.drawCircle = $("#drawCricle").on("click", function () {
        //     control.setDrawMode("circle");
        // });
        //
        // this.drawOff = $("#drawOff").on("click", function () {
        //     control.setDrawMode("off");
        // });

        this.coloringMode = $("#coloringMode");
        var coloringMode = this.coloringMode;
        this.coloringMode.on("change", function() {
            control.setColoringMode(coloringMode.val());
            updateLegend(coloringMode.val());
            control.redraw();
        });

        function updateLegend(value) {
            // var legend = document.getElementById('legend');

            if (value == "time") {
                // legend.src = "./images/MagnitudeTimeLegend.svg";
                var fromDate = new Date(queryParameters.FromDate);
                var toDate = new Date(queryParameters.ToDate);
                var interval = new Date(toDate - fromDate);

                var percent = [0.1, 0.3, 0.6, 1];
                for (var i in percent) {
                    var ageRanges = document.getElementById('agerange' + i);
                    var middle = new Date(fromDate);
                    middle.setDate(middle.getDate() + interval.getDate()*percent[i]);
                    var dd = middle.getDate();
                    var mm = middle.getMonth() + 1;
                    var y = middle.getYear() - 100;
                    ageRanges.textContent = '<' + y + '-' + mm + '-' + dd;
                }

                $('#MagnitudeLegendTable').each(function() {
                    $(this).hide();
                });

                $('#ageLegendTable').each(function() {
                    $(this).show();
                });

            } else if (value == "magnitude") {
                // legend.src = "./images/MagnitudeLegend.svg";
                $('#ageLegendTable').each(function() {
                    $(this).hide();
                });

                $('#MagnitudeLegendTable').each(function() {
                    $(this).show();
                });
            }

        }

        this.depthSlider = $("#depthSlider");



        this.FromDate = $("#fromdatepicker").datepicker({
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            yearRange: "1925:nn",
            dateFormat: "yy-mm-dd",
            onSelect: function(dateText, dateobj) {
                queryParameters.setFromDate(dateText);
                control.redraw();
            }
        });

        this.ToDate = $("#todatepicker").datepicker({
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            yearRange: "1925:nn",
            dateFormat: "yy-mm-dd",
            onSelect: function(dateText, dateobj) {
                queryParameters.setToDate(dateText);
                control.redraw();
            }
        });

        this.magSlider.slider({
            range: true,
            values: [2.5, 10.0],
            min: 0.0,
            max: 10.0,
            step: 0.1,
            animate: true,
            slide: function(event, ui) {
                $("#magSliderValue").html(ui.values[0].toString() + " to " +
                    ui.values[1].toString() + " Richter");

            },
            stop: function(event, ui) {
                queryParameters.setMinMagnitude(ui.values[0]);
                queryParameters.setMaxMagnitude(ui.values[1]);
                control.redraw();
            }

        });

        this.depthSlider.slider({
            range: true,
            values: [0, 1000],
            min: 0,
            max: 1000,
            step: 1,
            animate: true,
            slide: function(event, ui) {
                $("#depthSliderValue").html(ui.values[0].toString() + " to " +
                    ui.values[1].toString() + " KM");
            },

            stop: function(event, ui) {
                queryParameters.setMinDepth(ui.values[0]);
                queryParameters.setMaxDepth(ui.values[1]);
                control.redraw();
            }
        });


        this.opacitySlider.slider({
            value: 50,
            // min:     0,
            // max:     100,
            // step:    5,
            animate: true,
            slide: function(event, ui) {
                $("#opacitySliderValue").html(ui.value.toString() + "% opacity");
            },
            stop: function(event, ui) {
                control.setOpacity(ui.value / 100);
            }
        });

        this.limitset = $("#limitSet").on("click", function() {
            var limit = document.getElementById("limit").value;
            if (limit > 20000) {
                alert("Can not query beyond 20,000 events");
            } else {
                queryParameters.setLimit(limit);
                control.redraw();
            }
        });

        this.setCoordinate = function (point) {
            document.getElementById("coordSearch").value = point.Lati.toFixed(3).toString() + ',' + point.Long.toFixed(3).toString();
        };

        this.radiusSearch = $("#searchRadius").on("click", function() {
            var origin = document.getElementById("coordSearch").value;
            var radius = document.getElementById("radiusKMSearch").value;
            control.setDrawMode("radialSearch");
            queryParameters.setoriginlong(origin.split(",")[0]);
            queryParameters.setoriginlati(origin.split(",")[1]);
            queryParameters.setradius(radius);
            control.FancyLookAt(origin);
            control.redraw();
        });

        this.rightclickhandler = function(event) {
            var point = control.rightclickpoint;
            var x = event.clientX,
                y = event.clientY;
            point.update3Dfrom2D(x, y);
            control.updateSelectedPoint(point);
            var origin = document.getElementById("coordSearch").value;
            document.getElementById("radiusKMSearch").value = 500;
            var radius = 500;
            control.setDrawMode("radialSearch");
            queryParameters.setoriginlong(origin.split(",")[0]);
            queryParameters.setoriginlati(origin.split(",")[1]);
            queryParameters.setradius(radius);
            control.FancyLookAt(origin);
            control.redraw();
            // console.log(point);
        };

        this.reset = $("#reset").on("click", function() {
            document.index = 0;
            initializeUI(queryParameters);
            control.reset();
        });

        var GeoJSONHandler = function(controlGeoJSON) {
            var GeoJSON = controlGeoJSON;
            var eqArray = [];
            for (var i = 0; i < GeoJSON.features.length; i++) {
                if (GeoJSON.features[i].properties.mag > 4.5) {
                    eqArray.push(GeoJSON.features[i]);
                }
            }
            return eqArray;
        };

        this.touringfunctions = function () {

            document.index = 0;

            var tourEventLookAt = function(array, index) {
                var event = (array[index].geometry.coordinates[1].toString() + "," + array[index].geometry.coordinates[0].toString());
                control.FancyLookAt(event);
                control.tourMetadataDisplay(array, index);
            };

            this.tourUP = $("#forward").on("click", function () {
                var highMag = GeoJSONHandler(control.currentGeoJSON);
                if (document.index === highMag.length) {
                    document.index = 0;
                    tourEventLookAt(highMag, document.index);
                    document.index++;
                } else {
                    tourEventLookAt(highMag, document.index);
                    document.index++;
                }
            });

            this.tourDOWN = $("#backward").on("click", function () {
                var highMag = GeoJSONHandler(control.currentGeoJSON);
                if (document.index === 0) {
                    document.index = highMag.length;
                    document.index--;
                    tourEventLookAt(highMag, document.index);
                } else {
                    document.index--;
                    tourEventLookAt(highMag, document.index);
                }
            });
        };

        this.touringfunctions();

        function initializeUI(queryParameters) {
            var initialQuery = queryParameters.initialQuery;
            //  Pre-populate dropdowns with initial dates
            $("#fromdatepicker").datepicker("setDate", initialQuery.fromDate.split("T")[0]);
            $("#todatepicker").datepicker("setDate", initialQuery.toDate.split("T")[0]);

            $("#magSlider").slider("option", "values", [initialQuery.minMag, initialQuery.maxMag]);
            $("#magSliderValue").html($("#magSlider").slider("values", 0).toString() + " to " +
                $("#magSlider").slider("values", 1).toString() + " Richter");

            $("#depthSlider").slider("option", "values", [initialQuery.minDepth, initialQuery.maxDepth]);
            $("#depthSliderValue").html($("#depthSlider").slider("values", 0).toString() + " to " +
                $("#depthSlider").slider("values", 1).toString() + " KM");
            $("#coordSearch").val("");
            $("#radiusKMSearch").val("");

            document.getElementById('limit').value = "";

            queryParameters.setFromDate(initialQuery.fromDate.split("T")[0]);
            queryParameters.setToDate(initialQuery.toDate.split("T")[0]);
            queryParameters.setMinMagnitude(initialQuery.minMag);
            queryParameters.setMaxMagnitude(initialQuery.maxMag);
            queryParameters.setMinDepth(initialQuery.minDepth);
            queryParameters.setMaxDepth(initialQuery.maxDepth);
            queryParameters.setLimit(initialQuery.limit);

            drawingSelector[0].selectedIndex = 0;
            control.setDrawMode(drawingSelector.val());
            control.setColoringMode(coloringMode.val());
            updateLegend("time");
        }

        initializeUI(queryParameters);

        $("#magSliderValue").html(this.magSlider.slider("values", 0).toString() + " to " +
            this.magSlider.slider("values", 1).toString() + " Richter");
        $("#depthSliderValue").html(this.depthSlider.slider("values", 0).toString() + " to " +
            this.depthSlider.slider("values", 1).toString() + " KM");
        $("#dateSliderValue").html(this.dateSlider.slider("values", 0).toString() + " to " +
            this.dateSlider.slider("values", 1).toString() + " days");
        $("#opacitySliderValue").html(this.opacitySlider.slider("value").toString() + "% opacity");

    };

    return AnnotationController;
});
