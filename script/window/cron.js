mainWindowCron = function(){
    var _this = this;
    
    this.init = function(windowObject){
        var extensionData = windowObject.getData().extension;
        
        jQuery.ajax({
            url: extensionData.host + '/' + window.location.search
        }).done(function(data){
            jQuery('#cron-content').text(data);
        });
    }
}