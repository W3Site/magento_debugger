new function(){
    var _this = this;
    
    this.onMessageAction = function(msg, sender, sendResponse){
        switch(msg.action){
            case('gethtml'):
                sendResponse(document.all[0].outerHTML);
                break;
        }
    }
    
    {
        chrome.runtime.onMessage.addListener(_this.onMessageAction);
        chrome.runtime.sendMessage({action: "scriptLoaded"}, function(response) {});
    }
}
