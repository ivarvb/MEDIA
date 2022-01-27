/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2021
# E-mail: ivar@usp.br
*/
function gcolor(v) {
    var c = ["#00c234", "#ff0000", "#0062d1", "#801ac4", "#de7600"];
    return c[v];
}

function drawio(idview) {
    var self = this;

    this.homepath = "/";
    this.path = "";
    this.file = "";
    this.stack = Array(100).fill("");
    this.stacki = 0;
    this.width = 100;
    this.height = 100;
    this.data = [];

    var tcolors = ["#6e40aa", "#7140ab", "#743fac", "#773fad", "#7a3fae", "#7d3faf", "#803eb0", "#833eb0", "#873eb1", "#8a3eb2", "#8d3eb2", "#903db2", "#943db3", "#973db3", "#9a3db3", "#9d3db3", "#a13db3", "#a43db3", "#a73cb3", "#aa3cb2", "#ae3cb2", "#b13cb2", "#b43cb1", "#b73cb0", "#ba3cb0", "#be3caf", "#c13dae", "#c43dad", "#c73dac", "#ca3dab", "#cd3daa", "#d03ea9", "#d33ea7", "#d53ea6", "#d83fa4", "#db3fa3", "#de3fa1", "#e040a0", "#e3409e", "#e5419c", "#e8429a", "#ea4298", "#ed4396", "#ef4494", "#f14592", "#f34590", "#f5468e", "#f7478c", "#f9488a", "#fb4987", "#fd4a85", "#fe4b83", "#ff4d80", "#ff4e7e", "#ff4f7b", "#ff5079", "#ff5276", "#ff5374", "#ff5572", "#ff566f", "#ff586d", "#ff596a", "#ff5b68", "#ff5d65", "#ff5e63", "#ff6060", "#ff625e", "#ff645b", "#ff6659", "#ff6857", "#ff6a54", "#ff6c52", "#ff6e50", "#ff704e", "#ff724c", "#ff744a", "#ff7648", "#ff7946", "#ff7b44", "#ff7d42", "#ff8040", "#ff823e", "#ff843d", "#ff873b", "#ff893a", "#ff8c38", "#ff8e37", "#fe9136", "#fd9334", "#fb9633", "#f99832", "#f89b32", "#f69d31", "#f4a030", "#f2a32f", "#f0a52f", "#eea82f", "#ecaa2e", "#eaad2e", "#e8b02e", "#e6b22e", "#e4b52e", "#e2b72f", "#e0ba2f", "#debc30", "#dbbf30", "#d9c131", "#d7c432", "#d5c633", "#d3c934", "#d1cb35", "#cece36", "#ccd038", "#cad239", "#c8d53b", "#c6d73c", "#c4d93e", "#c2db40", "#c0dd42", "#bee044", "#bce247", "#bae449", "#b8e64b", "#b6e84e", "#b5ea51", "#b3eb53", "#b1ed56", "#b0ef59", "#adf05a", "#aaf159", "#a6f159", "#a2f258", "#9ef258", "#9af357", "#96f357", "#93f457", "#8ff457", "#8bf457", "#87f557", "#83f557", "#80f558", "#7cf658", "#78f659", "#74f65a", "#71f65b", "#6df65c", "#6af75d", "#66f75e", "#63f75f", "#5ff761", "#5cf662", "#59f664", "#55f665", "#52f667", "#4ff669", "#4cf56a", "#49f56c", "#46f46e", "#43f470", "#41f373", "#3ef375", "#3bf277", "#39f279", "#37f17c", "#34f07e", "#32ef80", "#30ee83", "#2eed85", "#2cec88", "#2aeb8a", "#28ea8d", "#27e98f", "#25e892", "#24e795", "#22e597", "#21e49a", "#20e29d", "#1fe19f", "#1edfa2", "#1ddea4", "#1cdca7", "#1bdbaa", "#1bd9ac", "#1ad7af", "#1ad5b1", "#1ad4b4", "#19d2b6", "#19d0b8", "#19cebb", "#19ccbd", "#19cabf", "#1ac8c1", "#1ac6c4", "#1ac4c6", "#1bc2c8", "#1bbfca", "#1cbdcc", "#1dbbcd", "#1db9cf", "#1eb6d1", "#1fb4d2", "#20b2d4", "#21afd5", "#22add7", "#23abd8", "#25a8d9", "#26a6db", "#27a4dc", "#29a1dd", "#2a9fdd", "#2b9cde", "#2d9adf", "#2e98e0", "#3095e0", "#3293e1", "#3390e1", "#358ee1", "#378ce1", "#3889e1", "#3a87e1", "#3c84e1", "#3d82e1", "#3f80e1", "#417de0", "#437be0", "#4479df", "#4676df", "#4874de", "#4a72dd", "#4b70dc", "#4d6ddb", "#4f6bda", "#5169d9", "#5267d7", "#5465d6", "#5663d5", "#5761d3", "#595fd1", "#5a5dd0", "#5c5bce", "#5d59cc", "#5f57ca", "#6055c8", "#6153c6", "#6351c4", "#6450c2", "#654ec0", "#664cbe", "#674abb", "#6849b9", "#6a47b7", "#6a46b4", "#6b44b2", "#6c43af", "#6d41ad", "#6e40aa"];
    var SCT = d3.interpolateRgbBasis(tcolors);

    ///////////////////////////////////////////
    ///////////////////////////////////////////
    ///////////////////////////////////////////

    this.lassoPolygon;
    this.lassoPath;
    this.scribble = 0;
    this.closePath;

    this.img = new Image();
    this.image;
    this.keycommand = 0;
    this.svgw;
    this.segments;
    this.draw;
    
    this.container;
    this.imgpath;
    this.setscribles = [];
    
    this.transform = d3.zoomIdentity;

    // self.mouse = d3.mouse()
    var deltaX, deltaY;

    self.drag = d3.drag()
        .on("start", function () {
                var ixy = d3.mouse(this);
                //self.lassoPolygon = [{"x":ixy[0],"y":ixy[1]}];
                console.log("ixy", ixy);

                ixy[0] = ixy[0];
                ixy[1] = ixy[1];

                
                self.lassoPolygon = [ixy];
                //self.transform


                
                // if (lassoPath) {
                //     lassoPath.remove();
                // }
                
                
                // self.lassoPath = self.container
                self.lassoPath = self.draw
                    .append('path')
                    .attr('fill', '#0bb')
                    .attr('fill-opacity', 0.1)
                    .attr('stroke-width', 2)
                    .attr('stroke', '#0bb');
                    //.attr('stroke', gcolor(1));
                    // .attr('stroke', SCT(0.0));

                    // .attr('stroke-dasharray', '3, 3');

                self.closePath = self.draw
                    .append('line')
                    .attr('x2', self.lassoPolygon[0][0])
                    .attr('y2', self.lassoPolygon[0][1])
                    .attr('stroke', '#0bb')
                    .attr('stroke-width', '2')
                    .attr('stroke-dasharray', '3, 3')
                    .attr('opacity', 0);
        })
/*        .on("start", function () {            
            if(self.keycommand==1){
                var current = self.container;
                ///var current = self.svgw;
                deltaX = current.attr("x") - d3.event.x;
                deltaY = current.attr("y") - d3.event.y;
                console.log("@@@@@@@@@@@",deltaX, deltaY);
            }
            else{
                d3.select(this).attr("cursor","cell");
            }

        })
        .on("drag", function (d) {
            if(self.keycommand==1){
                self.container
                //self.svgw
                .attr("x", d3.event.x + deltaX)
                .attr("y", d3.event.y + deltaY);
                console.log("@@@@@@@@@@@2222222",deltaX, deltaY);
            }
            else{
                d3.select(this).attr("cursor","cell");
            }
        });
        */
        .on("drag", function () {
                var point = d3.mouse(this);

                point[0] = point[0];
                point[1] = point[1];

                

                // point[0] = (point[0] * self.transform.k);
                // point[1] = (point[1] * self.transform.k);

                if (point[0]>=0 && point[0]<self.width && point[1]>=0 && point[1]<self.height){ 
                    gelem("idbottbar").innerHTML = "(x:"+Math.ceil(point[0])+", y:"+Math.ceil(point[1])+")";
                    // lassoPolygon.push({"x":point[0], "y":point[1]});
                    self.lassoPolygon.push(point);
                    // console.log("drag", lassoPolygon.length, inter.length);
                    // self.lassoPolygon = [{"x":point[0],"y":point[1]}];

                    self.lassoPath.attr('d', polygonToPath(self.lassoPolygon));
                    
                    self.closePath
                    .attr('x1', point[0])
                    .attr('y1', point[1])
                    .attr('opacity', 1);
                    
                }
        })
        .on("end", function () {
                
                //self.lassoPath.attr('d', polygonToPath(self.lassoPolygon) + 'Z');
                self.lassoPath.attr('d', polygonToPath(self.lassoPolygon));


                //polygonToPath(self.lassoPolygon)
                
                var fx = self.width - self.width*(1.0-self.transform.k);
                var fy = self.height - self.height*(1.0-self.transform.k);

                fx = self.width/fx;
                fy = self.height/fy;

                //console.log("fx, fy, self.width, self.height", fx, fy, self.width, self.height);
                for(var i in self.lassoPolygon){
                    self.lassoPolygon[i][0] = self.lassoPolygon[i][0]*fx;
                    self.lassoPolygon[i][1] = self.lassoPolygon[i][1]*fy;
                }
                

                self.closePath.remove();
                self.closePath = null;

                self.lassoPath.remove();
                self.lassoPath = null;
                self.lassoPolygon = null;                

        });





        // d3.select(idview).selectAll("svg").remove();
        // self.svgw = d3.select(idview).append("svg")
        //     .attr("width", self.width)
        //     .attr("height", self.height)
        //     .call(self.drag);
    
        // self.container = self.svgw.append("g")
        // .append('image')
        // .attr('xlink:href', '../data/input/oso.jpg');

    // self.zoom = d3.zoom()
    //     .scaleExtent([0.5, 15])
    //     .on("zoom", zoomed);

    // function zoomed() {
    //     self.transform = d3.event.transform;
    //     self.svgw.attr("transform", self.transform);
    //     self.container.attr("transform", self.transform);
    //     self.draw.attr("transform", self.transform);
    // }
    function dragged(d) {
        /* d3.select(this)
        .attr("x", d3.event.x)
        .attr("y", d3.event.y); */

        vx = d3.event.dx;
        vy = d3.event.dy;
        d3.select(this).attr("transform", "translate(" + vx + "," + vy + ")");
        
    }
    this.img.onload = function() {
        console.log(this.width + 'x' + this.height);
        console.log(self.img.src);
        
        self.width = self.img.width;
        self.height = self.img.height;

        console.log(self.width, self.height);
        
        gelem("idimginfo").innerHTML = "("+self.width+"X"+self.height+") "+self.width*self.height+" pixels";

        d3.select(idview).selectAll("svg").remove();

/*         self.mainL = d3.select(idview).append("svg")
        .attr("width", self.width)
        .attr("height", self.height);
 */

        /* self.mainlayout = d3.select(idview).append("svg")
        .attr("width", "100px")
        .attr("height", "100px");  */


        
        //self.svgw = self.mainlayout.append("svg")        
        self.svgw = d3.select(idview).append("svg")
            .attr("width", "100vw")
            .attr("height", "100vh")
            .call(self.drag)
            .call(self.zoom)
            .append("g");

            //.append("g");
/*             .call(
                    d3.zoom()
                    .on("zoom", function () {
                        self.svgw.attr("transform", d3.event.transform)
                    })
                    .scaleExtent([1,4])
                    .translateExtent([[0,0],[200,200]])
                ) */
            //.append("g");

    
        self.container = self.svgw.append("g")
            .attr("width", self.width)
            .attr("height", self.height)        
            .append('image')
            .attr('xlink:href', self.imgpath)
            .on('mousemove', function() {
                var point = d3.mouse(this);
                gelem("idbottbar").innerHTML = "(x:"+Math.ceil(point[0])+", y:"+Math.ceil(point[1])+")";
                // console.log( d3.mouse(this) ) // log the mouse x,y position
            })
            .on('mouseout', function() {
                gelem("idbottbar").innerHTML = "";
            });

        /* self.rect = self.svgw.append('rect')
            .attr('width', self.width)
            .attr('height', self.height)
            .style("stroke", 'red')
            .style("fill", "none")
            .style("stroke-width","3"); */

        // https://bl.ocks.org/eesur/6b362801cab5834e29185de9287a6181
        // const defs = self.svgw.append('defs')
        //     .append('clipPath')  // define a clip path
        //     .attr('id', 'clipx') // give the clipPath an ID
        //     .append('circle')
        //     .attr('cx', 280)
        //     .attr('cy', 160)
        //     .attr('r', 100);
        // self.svgw.append("g")
        //     .append('image')
        //     .attr('xlink:href', "data/oso.jpg")
        //     .attr("clip-path", "url(#clipx)")


        self.segments = self.svgw.append("g")
        //self.segments = self.container.append("g")
            .attr("width", self.width)
            .attr("height", self.height);
    
        self.draw = self.svgw.append("g")
        //self.draw = self.container.append("g")
            .attr("width", self.width)
            .attr("height", self.height);
    
                


        // self.container.select('image')
        // .attr('xlink:href', self.imgpath);
    };
    
    this.setscribblesclass = function(v){
        self.scribble = v;
    };

    this.drawsegmentation = function(segs){
        
        self.segments.selectAll("path").remove();    
        self.segments.selectAll("defs").remove();    
        self.segments.selectAll("mask").remove();    
        for (var i in segs){

            /* class */
            idmask = "myMask"+i;
            let mask = self.segments
              .append("defs")
              .append("mask")
              .attr("id", idmask);
              

            cc = Math.floor(Math.random() * 5);              
            if (segs[i]["intters"].length>0){
                mask.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", self.width)
                .attr("height", self.height)
                .style("fill", "white");

                console.log("XXXXXXXXX", segs[i]["intters"].length);
                for (innter of segs[i]["intters"]){
                    mask.append('path')
                        .attr('d', polygonToPath(innter)+"Z");      
                }    
            }

            points = segs[i]["outters"];
            let auxv = self.segments
                .append('path')
                .attr('fill', gcolor(cc))
                .attr('fill-opacity', 0.3)
                .attr('stroke-width', 2)
                .attr('stroke', d3.color(gcolor(cc)).darker())
                .attr('stroke-opacity', 0.7)
                .attr('d', polygonToPath(points)+"Z")
                .on("mousemove", function(d) {
                    d3.select(this)
                    .attr('stroke-opacity', 1.0)
                    .attr('stroke-width', 5);

                    //var point = d3.mouse(this);
                    self.setToolpiltex(
                        d3.event.pageX,
                        d3.event.pageY,
                        'Unlabeled'
                        );
                  })                  
                .on("mouseout", function(d) {
                    d3.select(this)
                    .attr('stroke-opacity', 0.5)
                    .attr('stroke-width', 2);

                    self.hideToolpiltex();
                });

            
            if (segs[i]["intters"].length>0){
                auxv.attr("mask", "url(#"+idmask+")");
            }
        }
    };

    this.chosseimage = function(path, phimage){
        gelem("lyimgpanel").style.display = "block";
        gelem("lylistpanel").style.display = "none";

        self.homepath = path;

        self.setscribles = [];

        self.imgpath = phimage;
        self.img.src = phimage;
    };

    this.clear = function(){
        self.segments.selectAll("path").remove();
        self.draw.selectAll("path").remove();
        
        self.setscribles = [];
    };

    this.executesegmentation = function(){


        
        console.log("self.homepath", self.homepath);
        
        var dataseg = [
                        {"points":[[0,0],[100,0],[10,100]], "class":0},
                        {"points":[[100,100],[100,200],[200,200],[300,100]], "class":1},
                        {"points":[[200,200],[400,200],[400,400],[200,600]], "class":3},

                        ];
        this.drawsegmentation(dataseg);
    };

    this.setToolpiltex = function (ex, ey, txt) {
        gelem("toolpiltex").innerHTML = "";
        gelem('toolpiltex').style.left = (ex + 2) + "px";
        gelem('toolpiltex').style.top = (ey - 23) + "px";
        gelem('toolpiltex').style.display = "block";
        gelem("toolpiltex").innerHTML = txt;
    };
    this.hideToolpiltex = function () {
        gelem("toolpiltex").style.display = "none";
        gelem("toolpiltex").innerHTML = "";
    };

/* 
    self.svgw.call(d3.zoom()
        .scaleExtent([0.05, 2])
        .on("zoom", zoomed)); */

    self.zoom = d3.zoom()
        .scaleExtent([0.05, 1])
        .on("zoom", zoomed);

    /* self.svgw.call(self.zoom); */

    function zoomed() {
        if(self.keycommand==0){
            self.transform = d3.event.transform;
            console.log(self.transform);
    
        //self.transform.x = (self.width*self.transform.k)/2.0;
        //self.transform.y = (self.height*self.transform.k)/2.0;

/* 
        //var current = d3.select(this);
        deltaX = self.container.attr("x") + self.transform.x;
        deltaY = self.container.attr("y") + self.transform.y;
        //console.log("deltaX, deltaY", deltaX, deltaY);
        self.transform.x = deltaX;
        self.transform.y = deltaY; */
        
        /* self.svgw.attr("transform", self.transform); */
        self.container.attr("transform", self.transform);
        //self.container.attr("transform", "translate("+self.transform.x+","+self.transform.y+") scale("+self.transform.k+")");
        //self.container.attr("transform", "scale("+self.transform.k+")");
 
 /*        self.container
            .attr("width", self.width*self.transform.k)
            .attr("height", self.height*self.transform.k); */
 


        self.segments.attr("transform", self.transform);
        
        /* self.rect.attr("transform", self.transform); */

        //self.container.attr("transform", "scale("+self.transform.k+")");
       /*  self.segments.selectAll("path")
        .attr("transform", self.transform); */

/*         self.segments.selectAll("path")
        .attr("transform", "scale("+self.transform.k+")"); */
        
        /*
        self.draw.selectAll("path")
        .attr("transform", "scale("+self.transform.k+")"); */

        // zoom others elements
        //
        //

        /* self.draw.selectAll("path")
        .attr("transform", "scale("+self.transform.k+")"); */

/*         self.draw.selectAll("path").attr("cx", function(){
            console.log("this", this.attr("cx"));
            return this.attr("cx")*self.transform.k;
        }); */
        //self.draw.selectAll.attr("cy", self.transform.k) + self.transform.y);


 /*        self.container
            .attr("width", self.width*self.transform.k)
            .attr("height", self.height*self.transform.k); */
 
        /* self.rect
            .attr('width', self.width*self.transform.k)
            .attr('height', self.height*self.transform.k);
             */
/* 



        self.draw
            .attr('width', self.width*self.transform.k)
            .attr('height', self.height*self.transform.k);
*/
/*         self.segments
            .attr('width', self.width*self.transform.k)
            .attr('height', self.height*self.transform.k);  */

        /* self.svgw.selectAll()
            .attr('width', self.width*self.transform.k)
            .attr('height', self.height*self.transform.k); */

        }
 
    }

/*     d3.select("body")
    .on("keypress", function() {
        console.log("control keuy", d3.event.ctrlKey);
        if(d3.event.ctrlKey){
            self.isdrag = true;
        };
    });    
     */
    document.addEventListener('keydown', (event) => {
        console.log("control press");
        if (event.ctrlKey || event.altKey ) {
            self.keycommand = 1;
        }
    });
    document.addEventListener('keyup', (event) => {
        console.log("control out");
        self.keycommand = 0;
    });

    /* document.addEventListener('keydown', function(event) {
        if (event.ctrlKey) {
            self.isdrag = true;
        }
        console.log("control keuy", event.ctrlKey);
    }); */
}