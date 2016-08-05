NASA WebWorldWind *Quake Hunter* Earthquake Visualization Application
====================
**Organization:** NASA Ames Research Center (PX)  
**Manager:** Patrick Hogan  
**Authors:** Benjamin Chang, Gabriel Militão, Farah Salah, Khaled Sharif  
**Acknowledgements:** Miguel Del Castillo, Bert Stewart

1. Introduction
-----
This is an earthquake visualization app built in NASA WebWorldWind. With the wealth of information on historic earthquakes readily available, an app that can aggregate and display this data dynamically is a valuable tool for understanding how tectonic plates interact with one another. *Quake Hunter* does just that, and can visualize several decades of earthquake data from the USGS, in 3D, either on the whole planet or in a user submitted geographically constrained query. With powerful querying tools, this application can provide exactly what the user asks to see in terms of earthquake event data around the world.

2. How to Run *Quake Hunters*
-----
###Run it the easy way:
You can go to worldwind.arc.nasa.gov/quakehunter to use the web app.
###Run it the hard way:
You can download or clone the repository in to local storage and run the `index.html` in a webserver (WebStorm provides a built in webserver).

3. How To Use
-----
###Querying Earthquakes:
  * Use the 'from' and 'to' calendar fill-ins to change the date range of the earthquakes visualized (this can be done all the way back to 1975).
  * The magnitude slider allows you to filter how large the earthquakes being visualized are.
  * Use the 'draw' function to draw rectangles or circles to geographically constrain the query on earthquake events.
  * The app should automatically generate a visualization of earthquake event hypocenters.
  * The reset button reverts the earthquakes displayed to the initial query.
###Visualization of subsurface features:
Try a geographically constrained query along a subduction zone or fault line (These are represented by the brown lines).
  * Set a specific sector of the planet to query earthquakes within.
  * Visualize a longer period of earthquakes (>20 years) and within the recommended magnitude range (2.5-10).
  * Use the canvas controls (in the bottom left-hand corner) to change the angle of viewing. This should provide a great visualization of how the tectonic plates interact with one another, whether in a subduction zone, a rift zone, or a hotspot.

4. Example Usage
------
![Initial Query](https://github.com/NASAWorldWindResearch/Quake-Hunter-App/blob/master/documentation_pix/new_eq_app1.png)
The initial query of the most recent 30 days of earthquake events in the range of magnitude 2.5-10  
![Geographically constrained query](https://github.com/NASAWorldWindResearch/Quake-Hunter-App/blob/master/documentation_pix/new_eq_app2.png)
A query showing the subduction zone in Kodiak Alaska.

5. Future Work
---
* Time series of EQ
* EQ Forecasting implementation (see [NASA WebWorldWind Research](https://github.com/NASAWorldWindResearch/EarthquakeApp))
* Toggle between magnitude and age color coding
* Greater UI control over layers
    * Toggle between placemarks, polygons, lines, etc.
