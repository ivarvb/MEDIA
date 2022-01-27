#!/bin/bash
PW="./python/python38media/"
install () {
    #sudo apt-get install python3-venv -y

    mkdir $PW
    python3 -m venv $PW
    source $PW"bin/activate"

    pip3 install wheel
    pip3 install numpy
    pip3 install tornado
    pip3 install ujson
    pip3 install matplotlib
    pip3 install pandas
    pip3 install cython
    pip3 install python-javabridge
    pip3 install python-bioformats
    pip3 install opencv-python
    pip3 install psutil
    pip3 install pipeproxy 
    pip3 install bcrypt
    pip3 install bson
    pip3 install pymongo
    pip3 install SimpleITK
    pip3 install scipy
    pip3 install shapely 
    pip3 install itk
    #pip3 install javabridge


    compile
}
compile () {
    #ddddd
    pwd

}
execute(){
    source $PW"bin/activate"
    
    cd ./sourcecode/src/
    python3 MEDIA.py
}
polygon(){
    source $PW"bin/activate"
    
    cd ./sourcecode/src/vx/media
    python3 Media.py
}
roi(){
    source $PW"bin/activate"
    
    cd ./sourcecode/src/vx/media
    python3 ROI.py
}

args=("$@")
T1=${args[0]}
if [ "$T1" = "install" ]; then
    install
elif [ "$T1" = "compile" ]; then
    compile
elif [ "$T1" = "polygon" ]; then
    polygon
elif [ "$T1" = "roi" ]; then
    roi
else
    execute
fi