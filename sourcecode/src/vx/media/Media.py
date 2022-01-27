#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2021
# E-mail: ivar@usp.br


import numpy as np

import ujson

import SimpleITK as sitk


from shapely import geometry

import cv2



#from scipy.spatial import ConvexHull, convex_hull_plot_2d

class Media:

    @staticmethod
    def write(file, obj):
        with open(file, "w") as filef:
            filef.write(ujson.dumps(obj))

    @staticmethod
    def read(file):
        data = {}
        with open(file,"r") as filef:
            data = (ujson.load(filef))
        return data
    
    
    @staticmethod
    def make_roids(image):

        """ (1) execute Oscar's algorithm"""

        """ (2) validate conex pixels for each region"""
        pass
        
    @staticmethod
    def make_contours(roids):
        """ return in format JSON contours of the rois in polygon form """

        image_mask = sitk.ReadImage(roids)

        lsif = sitk.LabelShapeStatisticsImageFilter()
        lsif.Execute(image_mask)
        labels = lsif.GetLabels()
        print("labels", labels)
        
        im_size = np.array(image_mask.GetSize())[::-1]
        image_array = sitk.GetArrayViewFromImage(image_mask)
        """ 
        dd1 = sitk.LabelContour(image_mask)
        reference_surface_arr = sitk.GetArrayViewFromImage(dd1)
        refpp = np.where(reference_surface_arr == 1)
        print("dd1", refpp)
         """
        """ 
        rng = np.random.default_rng()
        points = rng.random((30, 2))   # 30 random points in 2-D
        hull = ConvexHull(points)
        for simplex in hull.simplices:
            print("hulls", points[simplex, 0], points[simplex, 1])
        """
        xp = [1, 1, 0,-1,-1,-1, 0, 1]
        yp = [0, 1, 1, 1, 0,-1,-1,-1]
        print("im_size", im_size)
        #exit()
        results = []
        dd1 = sitk.LabelContour(image_mask)
        reference_surface_arr = sitk.GetArrayViewFromImage(dd1)

        for label in labels:
            maskk = np.zeros(im_size, dtype=np.uint8)
            maskk[np.where(image_array == label)] = 1
             
            #contours, hierarchy = cv2.findContours(maskk, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
            #contours, hierarchy = cv2.findContours(maskk, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            contours, hierarchy = cv2.findContours(maskk, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            

            # make polygons
            hierarchy = hierarchy[0]
            aupp = []
            for roww, hier in zip(contours, hierarchy):
                pauxpp = np.array([ [r[0][0], r[0][1]] for r in roww ], dtype=int)
                aupp.append(pauxpp.tolist())

            # make interiors contours
            auhier = [[] for e in hierarchy]
            for i in range(len(aupp)):
                i1d = hierarchy[i][3]
                if i1d != -1:
                    auhier[i1d].append(aupp[i])

            # append only outter contours
            for i in range(len(aupp)):
                if hierarchy[i][3] == -1:
                    results.append({"outters":aupp[i], "intters":auhier[i], "class":label, "group":label, "type":1})

        return results

    @staticmethod
    def make_contours2(roids):
        """ return in format JSON contours of the rois in polygon form """

        image_mask = sitk.ReadImage(roids)

        lsif = sitk.LabelShapeStatisticsImageFilter()
        lsif.Execute(image_mask)
        labels = lsif.GetLabels()
        print("labels", labels)
        
        """ 
        dd1 = sitk.LabelContour(image_mask)
        reference_surface_arr = sitk.GetArrayViewFromImage(dd1)
        refpp = np.where(reference_surface_arr == 1)
        print("dd1", refpp)
         """
        """ 
        rng = np.random.default_rng()
        points = rng.random((30, 2))   # 30 random points in 2-D
        hull = ConvexHull(points)
        for simplex in hull.simplices:
            print("hulls", points[simplex, 0], points[simplex, 1])
        """
        xp = [1, 1, 0,-1,-1,-1, 0, 1]
        yp = [0, 1, 1, 1, 0,-1,-1,-1]
        
        results = []
        dd1 = sitk.LabelContour(image_mask)
        reference_surface_arr = sitk.GetArrayViewFromImage(dd1)
        for label in labels:
            points = np.where(reference_surface_arr == label)
            #points = np.vstack((points[0], points[1])).T
            """ 
            aux = []
            print(len(points[1]))
            for i in range(len(points[1])):
                li = [points[0][i], points[1][i]]
                aux.append(li)

            points = aux """
            #print("points", points)
            """ 
            points = np.vstack((points[0], points[1])).T
            points = points.tolist() """


            """
            poly = geometry.Polygon(points)
            points = list(poly.exterior.coords)
            print(points)
            """

            #poly = np.array(poly.exterior.coords)
            #points = poly.tolist()
            
            #print(poly)
            #print("points", points)
            px = points[1].tolist()
            py = points[0].tolist()
            results.append({"pointsx":px, "pointsy":py, "class":label, "group":label})
            #print("results", results)
       

        print(results)
        return results

if __name__ == "__main__":        
    path ="/mnt/sda6/software/projects/data/media/lung/2021/05/ad2fa6a5c8dd472b8372eee7450c0156"
    
    
    rois_polygosn = Media.make_contours(path+"/"+"rois.nrrd")
    Media.write(path+"/"+"rois.json", rois_polygosn)
    

    rois_polygosn= Media.read(path+"/"+"rois.json")
    print(rois_polygosn)
