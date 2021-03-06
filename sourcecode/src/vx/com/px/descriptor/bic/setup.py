#https://medium.com/@xpl/protecting-python-sources-using-cython-dcd940bb188e
import setuptools  # important
from distutils.core import Extension, setup
from Cython.Build import cythonize

from Cython.Distutils import build_ext

#cimport numpy as np
import numpy



# define an extension that will be cythonized and compiled
extensions = [
        Extension(
            name="bic",
            sources=["bic.pyx"],
#            libraries=[],
            #library_dirs=["/usr/local/lib/","/usr/lib"],
            language="c",
            include_dirs=[numpy.get_include()]
            ),
        
    ]
setup(
    name = 'BIC',
    cmdclass = {'build_ext': build_ext},
    ext_modules=cythonize(extensions)
)
