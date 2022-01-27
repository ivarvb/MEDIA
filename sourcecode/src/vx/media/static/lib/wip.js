/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2021
# E-mail: ivar@usp.br
*/


var processkey = 0;
var process = {};
function pushprocess(p, pname, loading) {
    process[p] = pname;
    if(loading){
        showloading();
    }
    console.log("push p:", p, loading);
}
function popprocess(p, loading) {
    delete process[p];
    console.log("delete p:", p, Object.keys(process).length, process, loading);
    if (Object.keys(process).length == 0) {
        if(loading){
            hideloading();
        }
    }
}
function showloading() {
    gelem("idloading").style.display = "block";
}
function hideloading() {
    gelem('idloading').style.display = "none";
}



function ServiceData(pname) {
    var self = this;
    this.in = {"argms": {"type": 0}};
    this.ou = '';
    this.event = function () { };
    this.start = function () {
        processkey++;
        let ps = processkey;
        lo = false;
        if ("lo" in self.in){
            lo = self.in["lo"];
        }
        pushprocess(ps, pname, lo);
        try {
            var url = "./query?data=" + JSON.stringify(self.in);
/*             d3.json(url, function (data) {
                self.ou = data;
                self.event();
                popprocess(ps, lo);
            }); */
            d3.json(url).then(function(data){
               // data = data.concat(data);
                //render(data);
                self.ou = data;
                self.event();
                popprocess(ps, lo);

            });
        }
        catch (err) {
            popprocess(ps, lo);
            alert("Error: " + err.message);
        }
    };
}









function wip() {
    var self = this;

    this.homepath = "/";
    this.path = "";
    this.file = "";
    this.stack = Array(100).fill("");
    this.stacki = 0;
    this.width = 100;
    this.height = 100;
    this.data = [];

    this.opengallery = function(){
        gelem("lyimgpanel").style.display = "none";
        gelem("lylistpanel").style.display = "block";

        gelem("lylistview").innerHTML = "";
        var ob = new ServiceData("load gallery");
        ob.in.argms["type"] = 1;
        ob.event = function () {
            self.data = this.ou["response"];
            console.log("re", self.data);
            self.listimagestable();
            self.statusthread();
        };
        ob.start();
    };
    
    this.listimagestable = function(){
        var txtx = "";
        txtx = `
        <div class="tableFixHead">
        <table class="table table-striped table-sm btn-table" style="background-color: #fff; width: 100%;">
            <thead>
            <tr>
                <th style="text-align:left">Name</th>
                <th style="width: 70px;">Status</th>
                <th style="width: 120px;">Update</th>
                <th style="width: 120px;">Actions</th>
            <tr>
            </thead>
            <tbody>
        `;
        for(var i in self.data){
            re = self.data[i];
            //txtx += `<img src="data/`+re[i]["name"]+`" style="height: 80px; margin: 5px;"
            //            onclick="SCB.chosseimage('data/`+re[i]["name"]+`')";
            //        >`;
            txtx += `
            <tr onclick="
                DRW.chosseimage('`+re["y"]+`/`+re["m"]+`/`+re["id"]+`', 'data/`+re["y"]+`/`+re["m"]+`/`+re["id"]+`/`+re["image"]+`');"

                title = "`+re["y"]+`/`+re["m"]+`/`+re["id"]+`"
            >
                <td class="align-middle"  style="text-align:left">
                    `+re["name"]+`
                </td>
                <td class="align-middle">`;

            if (re["atributes"]["status"]==1){
                txtx += `<div>
                <i class="fa fa-check-circle" style="color: #0059b3"></i>
                </div>`;
            }
            else{
                txtx += `<div>
                <i class="fas fa-cog fa-spin" style="color: #ff0000"></i>
                </div>`;
            }   
            txtx += `
                </td>
                <td class="align-middle">
                    `+re["date"]+`
                </td>
                <td class="align-middle">
                    <!--
                    <a href="#" class="btn btn-light" style="padding: 2px;" title="Clone dataset"
                        onclick="
                            graphvis.clonedataset('5f52b46265aed74204758191');
                        "
                    >
                        <i class="fa fa-clone fa-lg" style="color: #1479d9;"></i>
                    </a>
                    -->
                    <a href="#" class="btn btn-light" style="padding: 2px;" title="Downlod dataset" 
                        onclick="
                            graphvis.downloaddataset('5f52b46265aed74204758191');
                        "
                    >
                        <i class="fa fa-download fa-lg" style="color: #f5a742;"></i>
                    </a>
                    <a href="#" class="btn btn-light" style="padding: 2px;" title="Drop dataset"
                        onclick="
                            graphvis.dropdataset('5f52b46265aed74204758191');
                        "
                    >
                        <i class="fa fa-trash fa-lg" style="color: #ff0000;"></i>
                    </a>
                </td>
            </tr>
            `;
        }
        txtx += `
        </tbody>
        </table>
        </div>`;
        gelem("lylistview").innerHTML = txtx;            
        gelem("idimginfo").innerHTML = "";
    };

    this.opendirectory = function(pathin, direcin){
/*         gelem("lyimgpanel").style.display = "none";
        gelem("lylistpanel").style.display = "block"; */

        gelem("lypaneldirsfiles").innerHTML = "";
        
        var ob = new ServiceData("load gallery");
        ob.in.argms["type"] = 2;
        ob.in.argms["path"] = pathin;
        ob.in.argms["directory"] = direcin;

        ob.event = function () {
            var re = this.ou["response"];
            var err = this.ou["error"];
            console.log("ss",err);
            if (err==1){
                alert(re);
                return 0;
            }
            path = re["path"];
            files = re["files"];

            self.stack[self.stacki] = path;
            self.stacki++;
    
            gelem("inputpathdir").value = path;

            txtx = `
            <div class="tableFixHead">
            <table class="table table-striped table-sm btn-table" style="background-color: #fff; width: 100%;">
                <thead>
                <tr>
                    <th style="text-align:left">Name</th>
                    <th style="width: 120px;">Modified</th>
                <tr>
                </thead>
                <tbody>
            `;
            for (i in files){
                fi = files[i]
                if(fi["type"]==1){
                    txtx += `
                    <tr 
                        ondblclick="
                            gelem('inputFilevsival').value = '`+fi["name"]+`';
                            SCB.showlayout('frmvsi');
                        "
                    >
                    <td class="align-middle"  style="text-align:left">
                        <i class="fas fa-file-alt" style="color: #333;"></i>
                        &nbsp;`+fi["name"]+`</div>
                    </td>
                    <td class="align-middle"  style="text-align:right">
                        `+fi["date"]+`
                    </td>
                    </tr>`;
                }
                else{
                    txtx += `
                    <tr 
                        ondblclick="
                            SCB.opendirectory('`+path+`','`+fi["name"]+`');
                        "
                        title="`+path+`"
                    >
                    <td class="align-middle"  style="text-align:left">
                        <i class="fa fa-folder" style="color: #256cb8;"></i>
                        &nbsp;`+fi["name"]+`
                    </td>
                    <td class="align-middle"  style="text-align:right">
                        `+fi["date"]+`
                    </td>
                    </tr>`;
                }                
            }
            txtx += "</tbody></table></div>"
            gelem("lypaneldirsfiles").innerHTML = txtx;
        };
        ob.start();
    };

    this.goBack = function(){
        self.stacki = self.stacki-2;
        if (self.stacki< 0){
            self.stacki = 0;
            self.stack[self.stacki] = self.homepath;
        }
        console.log("EEE",self.stack[self.stacki], self.stacki, self.stack);
        self.opendirectory(self.stack[self.stacki],'');
    };

    this.showlayout = function(op){
        gelem("lyfrminputpanel").style.display = "none";
        gelem("lyfrmuploadpanel").style.display = "none";
        gelem("lyfileopen").style.display = "none";
        gelem("lyimgpanel").style.display = "none";
        gelem("lylistpanel").style.display = "none";
    
        if (op=="gallerylist"){
            gelem("lylistpanel").style.display = "block";
        }
        else if (op=="galleryimg"){
            gelem("lylistpanel").style.display = "block";
        }
        else if (op=="frmvsi"){
            gelem("lyfrminputpanel").style.display = "block";
        }
        else if (op=="frmupload"){
            gelem("lyfrmuploadpanel").style.display = "block";
        }
        else if (op=="openfile"){
            gelem("lyfileopen").style.display = "block";
        }
        

    };

    this.opendirectory = function(pathin, direcin){
/*         gelem("lyimgpanel").style.display = "none";
        gelem("lylistpanel").style.display = "block"; */

        gelem("lypaneldirsfiles").innerHTML = "";
        
        var ob = new ServiceData("load gallery");
        ob.in.argms["type"] = 2;
        ob.in.argms["path"] = pathin;
        ob.in.argms["directory"] = direcin;

        ob.event = function () {
            var re = this.ou["response"];
            var err = this.ou["error"];
            console.log("ss",err);
            if (err==1){
                alert(re);
                return 0;
            }
            path = re["path"];
            files = re["files"];

            self.stack[self.stacki] = path;
            self.stacki++;
    
            gelem("inputpathdir").value = path;

            txtx = `
            <div class="tableFixHead">
            <table class="table table-striped table-sm btn-table" style="background-color: #fff; width: 100%;">
                <thead>
                <tr>
                    <th style="text-align:left">Name</th>
                    <th style="width: 120px;">Modified</th>
                <tr>
                </thead>
                <tbody>
            `;
            for (i in files){
                fi = files[i]
                if(fi["type"]==1){
                    txtx += `
                    <tr 
                        ondblclick="
                            SCB.setChooseFile(\``+path+`\`,\``+fi["name"]+`\`);
                        "
                    >
                    <td class="align-middle"  style="text-align:left">
                        <i class="fas fa-file-alt" style="color: #333;"></i>
                        &nbsp;`+fi["name"]+`</div>
                    </td>
                    <td class="align-middle"  style="text-align:right">
                        `+fi["date"]+`
                    </td>
                    </tr>`;
                }
                else{
                    txtx += `
                    <tr 
                        ondblclick="
                            SCB.opendirectory(\``+path+`\`,\``+fi["name"]+`\`);
                        "
                    >
                    <td class="align-middle"  style="text-align:left">
                        <i class="fa fa-folder" style="color: #256cb8;"></i>
                        &nbsp;`+fi["name"]+`
                    </td>
                    <td class="align-middle"  style="text-align:right">
                        `+fi["date"]+`
                    </td>
                    </tr>`;
                }                
            }

            txtx += "</tbody></table></div>"
            gelem("lypaneldirsfiles").innerHTML = txtx;
        };
        ob.start();
    };
    this.setChooseFile = function(path,file){
        self.path = path;
        self.file = file;
        gelem('idinputFilevsival').value = file;
        console.log(self.path, self.file);
        self.showlayout('frmvsi');
    };
    this.createimgpfromvsi = function(){
        var name = trim(gelem('idFileName').value);
        var factor = (gelem('idnumberfactor').value);

        if (name==""){
            ffocus('idFileName');
            return;
        }
        if (self.path=="" || self.file==""){
            ffocus('idinputFilevsival');
            return;
        }
/*         if (factor>0){
            ffocus('idnumberfactor');
            return;
        } */
            
        var ob = new ServiceData("load gallery");
        ob.in.argms["type"] = 3;
        ob.in.argms["name"] = name;
        ob.in.argms["path"] = self.path;
        ob.in.argms["file"] = self.file;
        ob.in.argms["factor"] = factor;

        ob.event = function () {
            var re = this.ou["response"];
            console.log("re",re);
            self.opengallery();
            self.showlayout('gallerylist');
        };
        ob.start();
    };

    this.createimgpfromupload = function(){
        gelem("lypaneldirsfiles").innerHTML = "";
                
        var ob = new ServiceData("load gallery");
        ob.in.argms["type"] = 4;
        ob.in.argms["name"] = pathin;
        ob.in.argms["vsifile"] = pathin;
        ob.in.argms["factor"] = direcin;

        ob.event = function () {
            var re = this.ou["response"];

            gelem("lypaneldirsfiles").innerHTML = txtx;
        };
        ob.start();
    };

    // xxxxxxxxxxxx xxxxxxxxxxxxxx
    this.load_roids_as_polygons = function(path){
        var ob = new ServiceData("load roids");
        ob.in.argms["type"] = 5;
        ob.in.argms["path"] = path;

        ob.event = function () {
            //var re = this.ou["response"];
            if (this.ou["error"]==0){
                console.log(this.ou["response"]);
                DRW.drawsegmentation(this.ou["response"]);                
            }
        };
        ob.start();
    };

    this.statusthread = function(){
        let ob = new ServiceData("load gallery validation");
        ob.in.argms["type"] = 1;
        ob.in["lo"] = false;
        ob.event = function () {
            datax = this.ou["response"];
            console.log("holax", this.in["lo"]);
            out = false;
            for(i in datax){
                self.data[i] = datax[i];
                if (self.data[i]["atributes"]["status"]==0){
                    out = true;
                }
            }
            if(out){
                setTimeout(function () { self.statusthread(); }, 4000);
            }
            else{
                //self.data = datax;
                self.listimagestable();
            }
        };
        ob.start();        
    };

    this.fullScreen = function () {
        var element = document.documentElement;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    };

    // this.chosseimage("../data/input/oso.jpg");
    // this.chosseimage("../data/input/llama2.jpg");
    this.opengallery();
    this.showlayout("gallerylist");
    this.opendirectory(this.homepath,'');
}

