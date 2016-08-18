*Quake Hunter*: Earthquake Activity Visualizer
====================
**Organization:** NASA Ames Research Center (PX)  
**Manager:** Patrick Hogan, Jonathan Stock  
**Authors:** Benjamin Chang, Gabriel Militão, Farah Salah, Khaled Sharif  
**Acknowledgements:** Miguel Del Castillo, Bert Stewart

1. Introduction
-----
This is an earthquake visualization app built in NASA WebWorldWind with support from the USGS Innovation Center for Earth Science, http://geography.wr.usgs.gov/ICES/. Given the wealth of USGS information on historic earthquakes, we designed and built an app that can aggregate and display over 100 years of seismic data dynamically. Quake Hunter is a valuable tool for understanding how tectonic plates interact with one another. *Quake Hunter* visualizes any range of earthquake data from the USGS, in 3D, either on the whole planet or in a user-defined geographically constrained area. With powerful querying tools, this application provids exactly what the user wants to see in terms of earthquake event data around the world.

2. How to Run *Quake Hunter*
-----
###Run it the easy way:
You can go to http://worldwind.arc.nasa.gov/quakehunter to use the web app.
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
  * Visualize a longer period of earthquakes (>20 years) and within the magnitude range M3-10.
  * Use the canvas controls (in the bottom left-hand corner) to change the angle of viewing. This should provide a great visualization of how the tectonic plates interact with one another, whether in a subduction zone, transform fault, rift zone, or a hotspot.

###Preformance Tips:
* If the earthquakes are not loading immediately after you enter search parameters, it may be loading. 
Look in the "Globe Options" to see if the "earthquakes" layer is loading. If the search involves in
excess of 5000 earthquakes, the load may take a while.
* If you continually run into performance issues, consider using
  Google Chrome or Apple Safari to run the web app.
* Try removing the tectonic plate layer for improved browsing speeds in the app.
* Consider limiting the earthquake event search to less than 2000 events for quicker load times
* For larger queries, the preformance greatly improves if searches are geographically constrained. To
        do this, use the drawing tool to limit where earthquakes are shown.


4. Example Usage
------
![Initial Query](https://github.com/NASAWorldWindResearch/Quake-Hunter-App/blob/master/documentation_pix/QH_overview.png)
The initial query of the most recent 30 days of earthquake events in the range of magnitude M3-10  
![Geographically constrained query 1](https://github.com/NASAWorldWindResearch/Quake-Hunter-App/blob/master/documentation_pix/QH_query1.png)
![Geographically constrained query 2](https://github.com/NASAWorldWindResearch/Quake-Hunter-App/blob/master/documentation_pix/QH_query2.png)
A query showing the subduction zone in Kodiak Alaska.

5. Future Work
---
* Time series of EQ
* EQ Forecasting implementation (see [NASA WebWorldWind Research](https://github.com/NASAWorldWindResearch/EarthquakeApp))