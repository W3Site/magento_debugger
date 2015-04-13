mainWindowMysql = function(){
    var _this = this;
    var _extensionData = null;
    var _followMessages = false;
    
    this.init = function(windowObject){
        _extensionData = windowObject.getData().extension;
        jQuery('#stop_following').on('click', function(){
            _this.followMessagesStop();
        })
        
        jQuery('#start_following').on('click', function(){
            _this.followMessagesStart();
        })
        
        jQuery('#mysql_content_clear_debug').on('click', function(){
            jQuery.ajax({
                url: _extensionData.host + '/?magento_debug=mysql&magento_debug_action=clearmessages'
            });
        })
        
        _this.followMessagesStart();
        _this.getLastData();
    }
    
    this.followMessagesStart = function(){
        jQuery('#stop_following').show();
        jQuery('#start_following').hide();
        _followMessages = true;
    }
    
    this.followMessagesStop = function(){
        jQuery('#stop_following').hide();
        jQuery('#start_following').show();
        _followMessages = false;
    }
    
    var _dataLength = 0;
    
    this.getLastData = function(){
        jQuery.ajax({
            url: _extensionData.host + '/?magento_debug=mysql&magento_debug_action=getmessages'
        }).done(function(data){
            var dataLength = data.length;
            jQuery('#mysql-content-list').text(data);
            if (_followMessages && dataLength != _dataLength){
                jQuery(window).scrollTop(jQuery(document).height());
            }
            _dataLength = dataLength;
            window.setTimeout(_this.getLastData, 1);
        });
    }
}