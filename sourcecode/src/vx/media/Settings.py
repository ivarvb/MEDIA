#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br

import os
class DBS:
    # Change here the local configuration of the MongoDB
    #DBGFF = {};
    DBMEDIA = {"host":"127.0.0.1", "port":"27017", "username":"admin", "password":"azul", "database":"mia","audb":"admin"};

class Settings:
    VERSION = 3.0
    ROOTID = 0
    DEBUG = True
    MULIUSER = 1
    DIRNAME = os.path.dirname(__file__)
    STATIC_PATH = os.path.join(DIRNAME, './static')
    TEMPLATE_PATH = os.path.join(DIRNAME, './templates')
    DATA_PATH = os.path.join(DIRNAME, '../../../../data/media/lung/')

    COOKIE_SECRET = 'L8LwECiNRxdq2W3NW1a0N2eGxx9MZlrpmu2MEdimlydNX/vt1LM='

    HOST = 'localhost'
    PORT = 8777

    PATHROOT = "http://localhost:"+str(PORT)+"/"
