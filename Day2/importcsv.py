#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Feb  6 12:25:18 2018

@author: eliaspedersen
"""

import matplotlib.pyplot as plt
import csv
import numpy as np
import random
import statistics

data = [[],[]]
with open('presidentialdata.csv') as csvfile:
    presidential = csv.reader(csvfile, delimiter=',')

    for row in presidential:
        data[0].append(row[1])
        data[1].append(row[2])


y = []
yDot = [7]*len(data[1])
for i in range(len(data[1])):
    y.append(float(3*random.random())+2)

#Jitter and dot plot
labels = ['dot','jitter']
months = list(map(int, data[1]))
plt.scatter(months,yDot, s = 50, marker='x', color = 'k', label = labels[0])
plt.scatter(months,y, s= 50, facecolors='none', edgecolor = 'k', label = labels[1])
axes = plt.gca()
axes.axes.get_yaxis().set_ticks([])
plt.legend()
axes.set_ylim([0,10])


#histogram
plt.show()
numBins = int(3.5*statistics.stdev(months)/len(data[1])**(1./3))
plt.hist(months, bins = numBins ,facecolor = 'none', edgecolor = 'k')
plt.savefig("histogram.svg")