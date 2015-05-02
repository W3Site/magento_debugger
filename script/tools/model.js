tools_model = function(){
    var _this = this;
    var _parent = null;
    var _data = {};
    
    this.init = function(parent){
        _parent = parent;
        _data = _parent.getData();
        
        // Debug model method
        if (_data.cookies.magento_debug_model){
        	_parent.jQuery('input[name=debug_model]').val(_data.cookies.magento_debug_model);
        }
        
        _parent.jQuery('input[name=debug_model]').on('keyup', function(){
        	_parent.setCookie('magento_debug_model', jQuery('input[name=debug_model]').val(), _this.getRootPath(_data.tab.url));
        });
        
        _parent.jQuery('input[name=debug_model_run]').on('click', function(){
            var value = _parent.jQuery('input[name=debug_model]').val();
            var host = _parent.getRootPath(_data.tab.url);
            
            var link = _parent.getRootPath(_data.tab.url) + '?magento_debug=model&magento_debug_model_method=' + value;
            
            _this.start(link);
        });
    }
    
    this.start = function(link){
    	debugger;
        _parent.ajax({
            'url' : link
        }, function(data){
            _parent.jQuery('#model-content').text(data);
        });
    }
}