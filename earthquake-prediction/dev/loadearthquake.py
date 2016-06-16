# NASA World Wind Earthquake load data code

import csv
import numpy as np
import pandas as pd
import datetime
import urllib

def eqload(minDate, maxDate, origin, minMagnitude = "3", maxdist = "300"):
	resourcesUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=csv"
	dates = "&starttime="+minDate+"&endtime="+maxDate
	magnitutes = "&minmagnitude"+minMagnitude
	local = "&latitude=" + origin['lati'] + "&longitude=" + origin['long'] + "&maxradiuskm=" + maxdist

	opener = urllib.FancyURLopener({})
	f = opener.open(resourcesUrl + dates + magnitutes + local)
	data = f.read()
	
	def parse_csv(data):
		earthquakes = []

		for line in data.split('\n'):
			eq = line.split(',')
			if len(eq) > 4:
				# earthquakes.append({'time': eq[0], 'latitude': eq[1], 'longitude': eq[2], 'mag': eq[4]})
				earthquakes.append([eq[0], eq[1], eq[2], eq[4]])

		return earthquakes[1:]

	eq = parse_csv(data)
	header = ['DateTime', 'Latitude', 'Longitude', 'EQ_Magnitude']
	eqdf = pd.DataFrame(eq, columns = header)
	eqt = pd.to_datetime(eqdf['DateTime'])
	eqdf.index = eqt
	eqdf.EQ_Magnitude = eqdf.EQ_Magnitude.astype('float')
	del eqdf['DateTime']
	return eqdf