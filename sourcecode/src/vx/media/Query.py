#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2021
# E-mail: ivar@usp.br


import tornado.ioloop
import tornado.web
import tornado.httpserver

import ujson
import glob
import os
import time
import sys

import pandas as pd
import numpy as np
import os.path
import math
import uuid

import zipfile
from io import BytesIO
from datetime import datetime
import threading



from vx.media.Settings import *
from vx.media.BaseHandler import *
from vx.media.VSI import *


class Query(BaseHandler):

    #Get RequestHandler
    def get(self):
        dat = self.get_argument('data')
        app = ujson.loads(dat)

        #app = DataTransfer()
        #app.load(dat)
        
        obj = ""

        if app["argms"]["type"]==0:
            pass;
        elif app["argms"]["type"]==1:
            obj = self.listimages();
        elif app["argms"]["type"]==2:
            obj = self.listfilesdirs(app["argms"]);
        elif app["argms"]["type"]==3:
            obj = self.makeimgfromvsi(app["argms"]);
        elif app["argms"]["type"]==4:
            obj = None
        elif app["argms"]["type"]==5:
            obj = self.getregions(app["argms"]);
            # print("obj-x",obj);

        self.write(obj)
        self.finish()


    #Post RequestHandler
    def post(self):
        pass




    # static query methods
    """
    def listimages():
        fileso = []
        for name in os.listdir(Settings.DATA_PATH):
            # print("name", name)
            if name.endswith(".png") or name.endswith(".jpg") or name.endswith(".jpeg"):
#                fileso.append(str(os.path.join(outdir, str(name))))
                # fileso.append({"name":Settings.IMAGE_PATH+str(name)})
                fileso.append({"name":str(name)})
        return {"response":fileso}
    """
    @staticmethod
    def listimages():
        fileso = []
        """
        for name in os.listdir(Settings.DATA_PATH):
            if name.endswith(".png") or name.endswith(".jpg") or name.endswith(".jpeg"):
                fileso.append({"name":str(name)})
        """

        ini = 2021
        months = ["01","02","03","04","05","06","07","08","09","10","11","12"]
        now = 2021
        for y in range(ini,now+1):
            for m in months:
                folder = os.path.join(Settings.DATA_PATH,str(y),str(m))
                if os.path.exists(folder):
                    for ide in os.listdir(folder):
                        if os.path.isdir(os.path.join(folder, ide)):
                            fileobj = os.path.join(folder, ide, "db.obj")
                            if os.path.exists(fileobj):
                                dat = Query.openFile(fileobj)
                                print("dat",dat, fileobj)
                                fileso.append(dat)
                                #fileso[ide] = {"y":y, "m":m, "data":dat}

        #fileso.sort(key=lambda item:item['date'], reverse=True)
        #fileso = sorted(fileso.items(), key=lambda x: x["date"])
        #fileso = sorted(fileso, key=lambda k: k['date']) 
        #print(fileso)
        fileso = sorted(fileso, key = lambda i: (i['date']), reverse=True)

        return {"response":fileso}



    # static query methods
    @staticmethod
    def listfilesdirs(argms):
        path = argms["path"]
        direc = argms["directory"]
        pathi = path
        if direc!="":
            pathi += "/"+direc

        result = []
        print("path", path)
        print("direc", direc)
        pathi = os.path.join(path,direc)
        print("pathii", pathi)
        try:
            for fil in os.listdir(pathi):
                cc = os.path.join(pathi,fil)

                modTimesinceEpoc = os.path.getmtime(cc)
                modificationTime = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(modTimesinceEpoc))
                print("cc",cc)
                if os.path.isfile(cc):
                    result.append({"name":fil,"type":1,"date":modificationTime})
                else:
                    result.append({"name":fil,"type":0,"date":modificationTime})
            result = sorted(result, key=lambda k: (k['type'], k['name']))
            result = {"response":{"path":pathi,"files":result}, "error":0}

        except FileNotFoundError:
            result = {"response":"FileNotFoundError", "error":1}
        except PermissionError:
            result = {"response":"PermissionError", "error":1}
        except:
            result = {"response":"UndefinedError", "error":1}
        finally:
            print("Done error checking")

        return result

    @staticmethod
    def makedir(outdir):
        if not os.path.exists(outdir):
            os.makedirs(outdir)

    @staticmethod
    def getPathSave(mainpath):
        dt_year = datetime.now().strftime("%Y")
        dt_mont = datetime.now().strftime("%m")
        idfolder = uuid.uuid4().hex
        mpth = os.path.join(mainpath, dt_year, dt_mont, idfolder)
        Query.makedir(mpth)
        return dt_year, dt_mont, idfolder, mpth
        
    # static query methods
    @staticmethod
    def makeimgfromvsi(argms):
        name = argms["name"]
        path = argms["path"]
        file = argms["file"]

        factor = argms["factor"]
        print("CC",name, path, file, factor)
        vsifile = os.path.join(path,file)
        """ pathsave = getdiresave(Settings.DATA_PATH) """

        #convertvsi2img(vsifile, factor, Settings.DATA_PATH, "df3wfsd")
        y, m, idf, pathsave = Query.getPathSave(Settings.DATA_PATH)
        
        fileid = uuid.uuid4().hex

        t = threading.Thread(target=Query.convertvsi2img, args=(vsifile, factor, pathsave, fileid,))
        t.start()
        
        dt_string = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        dbdat = {   
                    "y":y,
                    "m":m,
                    "id":idf,
                    "name":name,
                    "date":dt_string,
                    "image":fileid+".jpg",
                    "tumbail":fileid+".jpg",
                    "atributes":{"factor":factor,"status":0,"statusmsg":"working..."},
                    "images":[]
                }
        """
                    "images":[
                                {
                                    "name":"original",
                                    "date":dt_string,
                                    "image":fileid+".jpg",
                                    "tumbail":fileid+"_tumbail.jpg",
                                    "atributes":{},
                                }
                            ]
        """
        Query.writeFile(os.path.join(pathsave,"db.obj"), dbdat)
        #makeimage(filevis, factor, pathsave)
        
        result = {"response":"ok", "error":0}
        return result


    # get regions
    @staticmethod
    def getregions(argms):
        results = None
        try:
            pahfile = os.path.join(Settings.DATA_PATH, argms["path"]+"/"+"rois.json")
            rois = Query.openFile(pahfile)
            print("rois", rois)
            results = {"response":rois, "error":0}

        except FileNotFoundError:
            results = {"response":"FileNotFoundError", "error":1}
        except PermissionError:
            results = {"response":"PermissionError", "error":1}
        except:
            results = {"response":"UndefinedError", "error":1}
        finally:
            print("Done error checking")

        return results

    @staticmethod
    def convertvsi2img(vsifile, factor, pathout, outfile):
        outfiletiff = os.path.join(pathout,outfile+".tiff")
        outfilejpg = os.path.join(pathout,outfile+".jpg")
        outtumbailjpg = os.path.join(pathout,outfile+"_tumbail.jpg")
        
        BaseManager.register('VSI', VSI, exposed=['getAux','getnTilesX','getnTilesY'])
        manager = BaseManager()
        manager.start()
        obj = manager.VSI(vsifile, float(factor))
        print("obj.aux", obj.getAux())

        #obj = VSI(vsifile, float(factor))
        image = VSI.makeimage(obj)
        #image = readVSI(vsifile, float(factor))
        cv2.imwrite(outfiletiff, image)
        cv2.imwrite(outfilejpg, image)


        fileobj = os.path.join(pathout, "db.obj")
        dat = Query.openFile(fileobj)
        dat["atributes"]["status"] = 1
        dat["atributes"]["statusmsg"] = ""

        Query.writeFile(fileobj, dat)

    @staticmethod
    def openFile(pathf):
        dfile = {}
        with open(pathf,'r') as fp:
            dfile = ujson.load(fp)
        return dfile

    @staticmethod    
    def writeFile(pathf, rdata):
        with open(pathf,'w') as fp:
            ujson.dump(rdata, fp)
