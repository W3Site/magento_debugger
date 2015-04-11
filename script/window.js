/**
 * © Tereta Alexander (www.w3site.org), 2014-2015yy
 * All rights reserved.
 */

mainWindow = function(){
    var _this = this;
    var _data = {
        tab : {},
        cookies : {}
    };
    
    this.init = function(){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange=function(){
            if (xmlHttp.readyState==4 && xmlHttp.status==200){
            }
        }
        
        xmlHttp.onprogress=function(){
            document.getElementById("content").innerText=xmlHttp.responseText;
        }
        
        var hash = window.location.hash.substring(1);
        var hashValuesStrings = hash.split("&");
        var hashValues = new Object();
        for (hf = 0; hf < hashValuesStrings.length; hf++){
            hashValueSplit = hashValuesStrings[hf].split('=');
            hashValues[hashValueSplit[0]] = hashValueSplit[1];
        }
        
        xmlHttp.open("GET", hashValues.host + window.location.search,true);
        xmlHttp.send();
    }
}

mainWindow = new mainWindow;
jQuery(document).ready(mainWindow.init);