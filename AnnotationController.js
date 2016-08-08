/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define(['./USGS'], function (USGS) {
    "use strict";

    var AnnotationController = function (worldWindow, queryParameters, control) {
        this.worldWindow = worldWindow;

        this.magSlider = $("#magSlider");
        this.dateSlider = $("#dateSlider");
        this.opacitySlider = $("#opacitySlider");

        this.drawingSelector = $("#drawingSelection");

        var drawingSelector = this.drawingSelector;
        this.drawingSelector.on( "change", function() {
            control.setDrawMode(drawingSelector.val());
        });

        this.depthSlider = $("#depthSlider");

        this.FromDate = $("#fromdatepicker").datepicker({
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            yearRange: "1975:nn",
            dateFormat: "yy-mm-dd",
            onSelect: function (dateText, dateobj) {
                queryParameters.setFromDate(dateText);
                control.redraw();
            }
        });

        this.ToDate = $("#todatepicker").datepicker({
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            yearRange: "1975:nn",
            dateFormat: "yy-mm-dd",
            onSelect: function (dateText, dateobj) {
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
            slide: function (event, ui) {
                $("#magSliderValue").html(ui.values[0].toString() + " to " +
                    ui.values[1].toString() + " Richter");

            },
            stop: function (event, ui) {
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
            step: 100,
            animate: true,
            slide: function (event, ui) {
                $("#depthSliderValue").html(ui.values[0].toString() + " to " +
                ui.values[1].toString() + " KM");
            },

            stop: function (event, ui) {
                queryParameters.setMinDepth(ui.values[0]);
                queryParameters.setMaxDepth(ui.values[1]);
                control.redraw()
            }
        });


        this.opacitySlider.slider({
            value: 50,
            // min:     0,
            // max:     100,
            // step:    5,
            animate: true,
            slide: function (event, ui) {
                $("#opacitySliderValue").html(ui.value.toString() + "% opacity");
            },
            stop: function (event, ui) {
                control.setOpacity(ui.value/100);
            }
        });

        this.limitset = $("#limitSet").on("click", function () {
            var limit = document.getElementById("limit").value;
            if (limit > 20000){
                alert("Can not query beyond 20,000 events")
            } else {
                queryParameters.setLimit(limit);
                control.redraw()
            }
        });

        this.reset = $("#reset").on("click", function () {
            initializeUI(queryParameters);
            control.reset();
        });

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
