/**
 * Created by gagaus on 7/29/16.
 */

define(['./worldwindlib'],
    function(WorldWind) {

        "use strict";

        function Point(coordinates) {

            var longitude = coordinates[0],
                latitude = coordinates[1],
                depth = coordinates[2];

            var placemark,
                placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

            var canvas = document.createElement("canvas"),
                ctx2d = canvas.getContext("2d");
            var size = 1,
                c = size / 2 - 0.5,
                outerRadius = size / 2.2;
            canvas.width = size;
            canvas.height = size;
            ctx2d.fillStyle = ('rgb(0, 0, 0)');

            ctx2d.globalAlpha = 0.85;
            ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
            ctx2d.fill();

            // Create the placemark.
            placemark = new WorldWind.Placemark(new WorldWind.Position(latitude, longitude, -depth * 1000));
            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
            placemark.data = this;

            // Create the placemark attributes for the placemark.
            placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

            // Wrap the canvas created above in an ImageSource object to specify it as the placemark image source.
            placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);

            placemark.attributes = placemarkAttributes;
            this.placemark = placemark;
            this.placemark.center = new WorldWind.Position(latitude, longitude);
        }

        return Point;
    });
