chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    switch(msg.action){
        case('gethtml'):
            sendResponse(document.all[0].outerHTML);
            break;
    }
});