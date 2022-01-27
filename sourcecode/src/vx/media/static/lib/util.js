/*
# Author: Ivar Vargas Belizario
# Copyright (c) 2021
# E-mail: ivar@usp.br
*/
/* function addslashes(txt) {
    return txt.replace(/(["'])/g, "\\$1");
} */
function gelem(id) {
    return document.getElementById(id);
}
function gvalue(id) {
    return document.getElementById(id).value;
}
function trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
}
function ffocus(v) {
    gelem(v).focus();
}
function polygonToPath(polygon) {
    return ("M" + (polygon.map(function (d) { return d.join(','); }).join('L')));
}



