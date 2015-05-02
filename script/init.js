/**
 * © Tereta Alexander (www.w3site.org), 2014-2015yy
 * All rights reserved.
 */

var initialised = false;

chrome.devtools.panels.create(
    "Magento",
    "images/icon.png",
    "tools.html",
    function(panel) {
        panel.onShown.addListener(function(win){
            if (initialised){
                return;
            }
            initialised = true;
            
            initObject = new tools;
            initObject.init(win);
        });
    }
);