/**
 * © Tereta Alexander (www.w3site.org), 2014-2015yy
 * All rights reserved.
 */

var tools_mysql = function(){
    var _this = this;
    var _extensionData = null;
    var _followMessages = false;
    var _data = null;
    var _parent = null;
    
    this.init = function(parent){
        _parent = parent;
        _data = parent.getData();
        _parent.jQuery('#stop_following').on('click', function(){
            _this.followMessagesStop();
        })
        
        _parent.jQuery('#start_following').on('click', function(){
            _this.followMessagesStart();
        })
        
        _parent.jQuery('#mysql_content_clear_debug').on('click', function(){
            jQuery.ajax({
                url: _parent.getRootPath(_data.tab.url) + '/?magento_debug=mysql&magento_debug_action=clearmessages'
            });
        })
        
        _this.followMessagesStart();
        _this.getLastData();
    }
    
    this.followMessagesStart = function(){
        _parent.jQuery('#stop_following').show();
        _parent.jQuery('#start_following').hide();
        _followMessages = true;
    }
    
    this.followMessagesStop = function(){
        _parent.jQuery('#stop_following').hide();
        _parent.jQuery('#start_following').show();
        _followMessages = false;
    }
    
    var _dataLength = 0;
    
    this.getLastData = function(){
        if (_followMessages){
            _parent.ajax({
                url: _parent.getRootPath(_data.tab.url) + '/?magento_debug=mysql&magento_debug_action=getmessages'
            }, function(data){
                var dataLength = data.length;
                _parent.jQuery('#mysql-content-list').text(data);
                if (dataLength != _dataLength){
                    //jQuery(window).scrollTop(jQuery(document).height());
                    _parent.jQuery('#mysql-content-list').scrollTop(
                        _parent.jQuery('#mysql-content-list').height()
                    );
                }
                
                _dataLength = dataLength;
                window.setTimeout(_this.getLastData, 1);
            });
        }
        else{
            window.setTimeout(_this.getLastData, 1);
        }
    }
}