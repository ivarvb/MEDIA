#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Ivar Vargas Belizario
# Copyright (c) 2020
# E-mail: ivar@usp.br

import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.options

import signal

import ujson
import datetime
from multiprocessing import cpu_count


import os
import signal
import subprocess

from psutil import process_iter
from signal import SIGTERM # or SIGKILL

#from ipy.dataio import *
#from ipy.db import *

from vx.media.Settings import *
from vx.media.BaseHandler import *
from vx.media.Query import *
from vx.media.Pages import *

def sig_exit():
    tornado.ioloop.IOLoop.instance().add_callback_from_signal(do_stop)

def do_stop():
    tornado.ioloop.IOLoop.instance().stop()

class Server(tornado.web.Application):
    """ is_closing = False """

    def __init__(self):
        handlers = [
            (r"/", Index),
            (r"/login", Login),
            (r"/logout", Logout),
            (r"/query", Query),
            (r"/lung", Lung),
            (r"/simil", Simil),

            (r"/lib/(.*)",tornado.web.StaticFileHandler, {"path": Settings.STATIC_PATH+"/lib"},),
            (r"/img/(.*)",tornado.web.StaticFileHandler, {"path": Settings.STATIC_PATH+"/img"},),
            (r"/data/(.*)",tornado.web.StaticFileHandler, {"path": Settings.DATA_PATH},),
            # (r"/data/(.*)",tornado.web.StaticFileHandler, {"path": "./static/data"},),
            # (r"/img/(.*)",tornado.web.StaticFileHandler, {"path": "./static/img"},)
        ]
        settings = {
            "template_path":Settings.TEMPLATE_PATH,
            "static_path":Settings.STATIC_PATH,
#            "debug":Settings.DEBUG,
            "cookie_secret": Settings.COOKIE_SECRET,
        }
        tornado.web.Application.__init__(self, handlers, **settings)

    """ 
    def signal_handler(self, signum, frame):
        print('exiting...')
        self.is_closing = True

    def try_exit(self):
        if self.is_closing:
                # clean up here
            tornado.ioloop.IOLoop.instance().stop()
            print('exit success')
    """

    @staticmethod
    def execute():

        print ('The server is ready: http://'+Settings.HOST+':'+str(Settings.PORT)+'/')
        serverapp = Server()
        server = tornado.httpserver.HTTPServer(Server())

        """ tornado.options.parse_command_line() """
        """ signal.signal(signal.SIGINT, serverapp.signal_handler) """

        server.bind(Settings.PORT)
        server.start(cpu_count())
    #    tornado.ioloop.IOLoop.current().start()
    #    tornado.ioloop.IOLoop.instance().start()

        try:
            """ tornado.ioloop.PeriodicCallback(serverapp.try_exit, 100).start() """
            signal.signal(signal.SIGINT, sig_exit)
            tornado.ioloop.IOLoop.instance().start()

        # signal : CTRL + BREAK on windows or CTRL + C on linux
        except KeyboardInterrupt:
            #tornado.ioloop.IOLoop.instance().stop()
            pass
        finally:
            print("XXXXXXXXX")

#if __name__ == "__main__":
#    print ('The server is ready: http://'+Settings.HOST+':'+str(Settings.PORT)+'/')
#    server = tornado.httpserver.HTTPServer(Server())
#    server.bind(Settings.PORT)
#    server.start(cpu_count())
##    tornado.ioloop.IOLoop.current().start()
#    tornado.ioloop.IOLoop.instance().start()










