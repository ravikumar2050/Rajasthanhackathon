# -*- coding: utf-8 -*-
"""
Created on Sun Jul 15 12:39:36 2018

@author: coolr
"""
#import libraries
import numpy as np
import colorsys
import pandas as pd
import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap
import hdbscan

#import dataset
dataset=pd.read_csv("data.csv")
latlon=np.array(dataset.iloc[:,4:6])
latitude=dataset.iloc[:,4].values
longitude=dataset.iloc[:,5].values
magnitude=dataset.iloc[:,6]
regions=dataset.iloc[:,9]

#making the model

clusterer=hdbscan.HDBSCAN(min_cluster_size=10,min_samples=1).fit(latlon)
labels=clusterer.labels_


########################################################

countcluster=np.bincount(labels[labels>=0])

indexlength=np.size(countcluster)

rangetobeindexed=np.arange(indexlength)

newarr=np.column_stack((countcluster,rangetobeindexed))

###################################################################





#increase/decrease figure size
plt.figure(figsize=(12,6))

#set latitude longitude for rotation,set areathresh for better details ,set resolution
map = Basemap(projection='robin',lat_0=0, lon_0=0,area_thresh=1000)
map.bluemarble(scale=0.3);



#to draw countires
map.drawcountries()


#draw longitude and latitude lines
map.drawmeridians(np.arange(0, 360, 30))
map.drawparallels(np.arange(-90, 90, 30))
      

#map.drawmapboundary(fill_color='aqua')


#use below line for coloring continent
#map.fillcontinents(color='coral',lake_color='aqua')




#to draw border around continets
map.drawcoastlines()

#convert latitude and longitude points to map points
x, y = map(longitude,latitude)


#plot map points on to globe



map.scatter(x, y,marker='.',c= clusterer.labels_,zorder=2,cmap='prism')
    


#map.scatter(x, y, marker='.',color='yellow',zorder=2)

#plt.colorbar(label=rangetobeindexed)
#show the plot
plt.show()




 
