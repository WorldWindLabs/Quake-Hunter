/**
 * Created by gagaus on 7/29/16.
 */

define(['./Draw'], function(Draw) {
    "use strict";

    // USGS API
    var USGS = function (wwd, control) {
        var currentTimeUTC = +new Date();
        var minDateISO = new Date(currentTimeUTC + -30 * 24 * 60 * 60 * 1000).toISOString().split(/[-]+/);
        var maxDateISO = new Date(currentTimeUTC + 0 * 24 * 60 * 60 * 1000).toISOString().split(/[-]+/);
        minDateISO[minDateISO.length - 1] = minDateISO[minDateISO.length - 1].split('.')[0];
        maxDateISO[maxDateISO.length - 1] = maxDateISO[maxDateISO.length - 1].split('.')[0];

        var queryParameters = function () {
            this.minMagnitude = 2.5;
            this.maxMagnitude = 10;

            this.FromDate = minDateISO.join('-');
            this.ToDate = maxDateISO.join('-');
            this.Limit = 20000;

            this.MinLongitude = -360;
            this.MaxLongitude = 360;
            this.MinLatitude = -90;
            this.MaxLatitude = 90;

            this.minDepth = 0;
            this.maxDepth = 1000;

            this.initialQuery = {minMag: 2.5,
                maxMag: 10,
                fromDate: minDateISO.join('-'),
                toDate: maxDateISO.join('-'),
                minDepth: 0,
                maxDepth: 1000,
                limit: 20000};

            this.update = function (fig, mode) {
                if (mode == "rectangle") {
                    var p1 = fig.p1;
                    var p2 = fig.p2;

                    var minLong = Math.min(p2.Long, p1.Long);
                    var maxLong = Math.max(p2.Long, p1.Long);

                    var minLati = Math.min(p2.Lati, p1.Lati);
                    var maxLati = Math.max(p2.Lati, p1.Lati);

                    this.MinLatitude = minLati;
                    this.MinLongitude = minLong;
                    this.MaxLatitude = maxLati;
                    this.MaxLongitude = maxLong;
                }

                if (mode == "circle") {
                    console.log("IMPLEMENT CIRCLE UPDATE QUERY");
                }
            };

            this.setFromDate = function (value) {
                this.FromDate = value;
            };
            
            this.setToDate = function (value) {
                this.ToDate = value;
            };
            
            this.setMinMagnitude = function (value) {
                this.minMagnitude = value;
            };
            
            this.setMaxMagnitude = function (value) {
                this.maxMagnitude = value;
            };
            
            this.setLimit = function (value) {
                this.Limit = value;
            };

            this.setMinDepth = function (value) {
                this.minDepth = value
            };

            this.setMaxDepth = function (value) {
                this.maxDepth = value;
            };
            
            this.setMinLatitude = function(value) {
                this.MinLatitude = value;
            };
            
            this.setMaxLatitude = function(value) {
                this.MaxLatitude = value;
            };
            
            this.setMinLongitude = function(value) {
                this.MinLongitude = value;
            };
            
            this.setMaxLongitude = function(value) {
                this.MaxLongitude = value;
            };
        };

        this.parameters = new queryParameters();

        this.getUrl = function (drawingType) {
            var minMagnitude = this.parameters.minMagnitude,
                maxMagnitude = this.parameters.maxMagnitude,
                FromDate = this.parameters.FromDate,
                ToDate = this.parameters.ToDate,
                limit = this.parameters.Limit,
                origin = this.parameters.Origin,
                radius3D = this.parameters.Radius,
                minLatitude = this.parameters.MinLatitude,
                maxLatitude = this.parameters.MaxLatitude,
                minLongitude = this.parameters.MinLongitude,
                maxLongitude = this.parameters.MaxLongitude,
                minDepth = this.parameters.minDepth,
                maxDepth = this.parameters.maxDepth;

            var resourcesUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson";
            var query;
            if (drawingType == 'circle') {
                query = "starttime=" + FromDate +
                    "&endtime=" + ToDate +
                    "&minmagnitude=" + minMagnitude.toString() +
                    "&maxmagnitude=" + maxMagnitude.toString() +
                    "&longitude=" + origin.Long.toString() +
                    "&latitude=" + origin.Lati.toString() +
                    "&mindepth=" + minDepth.toString() +
                    "&maxdepth=" + maxDepth.toString() +
                    "&maxradiuskm=" + radius3D.toString();
            }
            else if (drawingType == 'rectangle') {
                query = "starttime=" + FromDate +
                    "&endtime=" + ToDate +
                    "&minmagnitude=" + minMagnitude.toString() +
                    "&maxmagnitude=" + maxMagnitude.toString() +
                    "&minlongitude=" + minLongitude.toString() +
                    "&maxlongitude=" + maxLongitude.toString() +
                    "&minlatitude=" + minLatitude.toString() +
                    "&maxlatitude=" + maxLatitude.toString()+
                    "&mindepth=" + minDepth.toString() +
                    "&maxdepth=" + maxDepth.toString();
            }
            else {
                query = "starttime=" + FromDate +
                    "&endtime=" + ToDate +
                    "&minmagnitude=" + minMagnitude.toString() +
                    "&maxmagnitude=" + maxMagnitude.toString() +
                    "&mindepth=" + minDepth.toString() +
                    "&maxdepth=" + maxDepth.toString();
            }

            var url = resourcesUrl + '&' + query + "&limit=" + limit.toString();
            console.log(url);
            return url;
        };

        var earthquakes = this;
        var firstTime = true;
        var layer;

        this.redraw = function(draw) {
            var drawOption = draw.getDrawMode();
            var drawingState = 0;
            var drawFig = 0;

            if (firstTime) {
                $.get(this.getUrl(), function (EQ) {
                    layer = draw.placeMarkCreation(EQ, earthquakes);
                    control.initializeHandlers();
                });
                firstTime = false;
            }
            else {
                this.parameters.update(draw.queryFig, drawOption);
                $.get(this.getUrl(drawOption), function (EQ) {
                    wwd.removeLayer(layer);
                    layer = draw.placeMarkCreation(EQ, earthquakes);
                });
            }
        };

    };

    return USGS;
});
