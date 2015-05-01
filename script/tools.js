tools = function(){
    var _this = this;
    var _devWindow = null;
    var _data = null;
    
    this.getData = function(){
        return _data;
    }
    
    this.getRootPath = function(url){
        var match = url.match(/.*:\/\/[^\/]*/i);
        if (!match){
            return;
        }
        
        return match[0];
    }
    
    this.jQuery = function(selector){
        return jQuery(_devWindow.document).find(selector)
    }
    
    this.ajax = function(data, done){
        chrome.extension.sendRequest({
            'method' : 'ajax',
            'data'   : data
        }, done);
    }
    
    this.setCookie = function(key, value, url, path){
        if (typeof path == 'undefined'){
            path = '/';
        }
        
        chrome.extension.sendRequest({
            'method' : 'setCookie',
            'key'    : key,
            'value'  : value,
            'url'    : url,
            'path'   : path
        });
    }
    
    this.showWindowDebugger = function(data){
        _this.jQuery('.debug_window').removeClass('active');
        _this.jQuery('.debug_form').addClass('active');
        
        // Reload page
        _this.jQuery('#reload_page').on('click', function(){
            _this.reloadChromeWindow(_data.tab.id);
        });
        
        // Backend config
        _this.jQuery('#backend_config').on('click', function(){
            _this.openChromeWindow(_this.getRootPath(_data.tab.url) + '/?magento_debug=configure', 'tab')
        });
        
        // Clear all
        _this.jQuery('#clear_all').on('click', function(){
            _this.setCookie('magento_debug_blocks', 'no', _this.getRootPath(_data.tab.url));
            _this.setCookie('magento_debug_mails', 'no', _this.getRootPath(_data.tab.url));
            _this.setCookie('magento_debug_mysql', 'no', _this.getRootPath(_data.tab.url));
            _this.setCookie('magento_debug_mysql_trace', 'no', _this.getRootPath(_data.tab.url));
            _this.setCookie('magento_debug_mysql_value', '0.5', _this.getRootPath(_data.tab.url));
            _this.setCookie('magento_debug_password_admin', 'no', _this.getRootPath(_data.tab.url));
            _this.setCookie('magento_debug_profiler', 'no', _this.getRootPath(_data.tab.url));
            
            _this.jQuery('#debug_blocks').prop('checked', false);
            _this.jQuery('input[name=debug_mails]').prop('checked', false);
            _this.jQuery('input[name=debug_mysql][value=no]').prop('checked', true);
            _this.jQuery('input[name=debug_mysql_value]').val('0.5');
            _this.jQuery('#debug_mysql_trace').prop('checked', false);
            _this.jQuery('input[name=debug_password_admin]').prop('checked', false);
            _this.jQuery('input[name=debug_profiler]').prop('checked', false);
        });
        
        // Allow all passwords for admin
        if (_data.cookies.magento_debug_password_admin == 'yes'){
            _this.jQuery('input[name=debug_password_admin]').prop('checked', true);
        }
        
        _this.jQuery('input[name=debug_password_admin]').on('change', function(){
            if (_this.jQuery('input[name=debug_password_admin]').is(':checked')){
                _this.setCookie('magento_debug_password_admin', 'yes', _this.getRootPath(_data.tab.url));
            }
            else{
                _this.setCookie('magento_debug_password_admin', 'no', _this.getRootPath(_data.tab.url));
            }
        });
        
        // Profiler
        if (_data.cookies.magento_debug_profiler == 'yes'){
            _this.jQuery('input[name=debug_profiler]').prop('checked', true);
        }
        
        _this.jQuery('input[name=debug_profiler]').on('change', function(){
            if (_this.jQuery('input[name=debug_profiler]').is(':checked')){
                _this.setCookie('magento_debug_profiler', 'yes', _this.getRootPath(_data.tab.url));
            }
            else{
                _this.setCookie('magento_debug_profiler', 'no', _this.getRootPath(_data.tab.url));
            }
        });
        
        // Debug blocks
        if (_data.cookies.magento_debug_blocks == 'yes'){
            _this.jQuery('#debug_blocks').prop('checked', true);
        }
        
        _this.jQuery('#debug_blocks').on('change', function(){
            if (_this.jQuery('#debug_blocks').is(':checked')){
                _this.setCookie('magento_debug_blocks', 'yes', _this.getRootPath(_data.tab.url));
            }
            else{
                _this.setCookie('magento_debug_blocks', 'no', _this.getRootPath(_data.tab.url));
            }
        });
        
        // Debug mails
        if (_data.cookies.magento_debug_mails == 'yes'){
            _this.jQuery('input[name=debug_mails]').prop('checked', true);
        }
        
        _this.jQuery('input[name=debug_mails]').on('change', function(){
            if (_this.jQuery('input[name=debug_mails]').is(':checked')){
                _this.setCookie('magento_debug_mails', 'yes', _this.getRootPath(_data.tab.url));
            }
            else{
                _this.setCookie('magento_debug_mails', 'no', _this.getRootPath(_data.tab.url));
            }
        });
        
        // Debug mysql
        if (_data.cookies.magento_debug_mysql == 'no'){
            _this.jQuery('input[name=debug_mysql][value=no]').prop('checked', true);
        }
        
        if (_data.cookies.magento_debug_mysql == 'all'){
            _this.jQuery('input[name=debug_mysql][value=all]').prop('checked', true);
        }
        
        if (_data.cookies.magento_debug_mysql == 'value'){
            _this.jQuery('input[name=debug_mysql][value=value]').prop('checked', true);
        }
        
        if (_data.cookies.magento_debug_mysql_value){
            _this.jQuery('input[name=debug_mysql_value]').val(_data.cookies.magento_debug_mysql_value);
        }
        
        _this.jQuery('input[name=debug_mysql_value]').on('keyup', function(){
            var value = _this.jQuery('input[name=debug_mysql_value]').val();
            _this.setCookie('magento_debug_mysql_value', value, _this.getRootPath(_data.tab.url));
        });
        
        _this.jQuery('input[name=debug_mysql]').on('change', function(){
            var debugMysql = _this.jQuery('input[name=debug_mysql]:checked').val();
            
            _this.setCookie('magento_debug_mysql', debugMysql, _this.getRootPath(_data.tab.url));
        });

        if (_data.cookies.magento_debug_mysql_trace == 'yes'){
            _this.jQuery('#debug_mysql_trace').prop('checked', true);
        }
        
        _this.jQuery('#debug_mysql_trace').on('change', function(){
            if (_this.jQuery('#debug_mysql_trace').is(':checked')){
                _this.setCookie('magento_debug_mysql_trace', 'yes', _this.getRootPath(_data.tab.url));
            }
            else{
                _this.setCookie('magento_debug_mysql_trace', 'no', _this.getRootPath(_data.tab.url));
            }
        });
        
        // Debug model method
        if (_data.cookies.magento_debug_model){
            _this.jQuery('input[name=debug_model]').val(_data.cookies.magento_debug_model);
        }
        
        _this.jQuery('input[name=debug_model]').on('keyup', function(){
            _this.setCookie('magento_debug_model', jQuery('input[name=debug_model]').val(), _this.getRootPath(_data.tab.url));
        });
        
        _this.jQuery('input[name=debug_model_run]').on('click', function(){
            var value = _this.jQuery('input[name=debug_model]').val();
            var host = _this.getRootPath(_data.tab.url);
            
            var params = {
                'host':_this.getRootPath(_data.tab.url)
            };
            
            var jsonString = jQuery.stringify(params);
            var link = 'window.html?magento_debug=model&magento_debug_model_method=' + value + '#' + jQuery.base64.encode(jsonString);
            
            _this.openChromeWindow(link, 'popup');
        });
    }
    
    this.showWindowUpdate = function(options){
        var version = chrome.runtime.getManifest().version;
        var backendVersion = options.backend.version;
        var backend_extension_link = 'https://github.com/w3site/magento_debugger_backend/archive/version-' + version + '.zip';
        _this.jQuery('.debug_update .current_version').html(version);
        _this.jQuery('.debug_update .backend_version').html(backendVersion);
        _this.jQuery('.debug_update .download_extension_link').attr('href', backend_extension_link);
        
        debugger;
        _this.jQuery('.debug_update .update-message').removeClass('active');
        switch(options.error_code){
            case(1):
                _this.jQuery('.debug_update .update-instruction').addClass('active');
                break;
            default:
                _this.jQuery('.debug_update .update-default').html(options.error_message);
                _this.jQuery('.debug_update .update-default').addClass('active');
                break;
        }
        
        _this.jQuery('.debug_window').removeClass('active');
        _this.jQuery('.debug_update').addClass('active');
    }
    
    this.showWindowInstallation = function(){
        var version = chrome.runtime.getManifest().version;
        var backend_extension_link = 'https://github.com/w3site/magento_debugger_backend/archive/version-' + version + '.zip';
        _this.jQuery('.debug_install .current_version').html(version);
        _this.jQuery('.debug_install .download_extension_link').attr('href', backend_extension_link);
        _this.jQuery('.debug_window').removeClass('active');
        _this.jQuery('.debug_install').addClass('active');
    }
    
    this.showWindowUnavaliable = function(){
        _this.jQuery('.debug_window').removeClass('active');
        _this.jQuery('.debug_unavaliable').addClass('active');
    }
    
    // Open link at target
    this.openChromeWindow = function(link, type){
        chrome.extension.sendRequest({
            'method' : 'openChromeWindow',
            'link': link,
            'type' : type
        });
    }
    
    this.reloadChromeWindow = function(tabId){
        chrome.extension.sendRequest({
            'method' : 'reloadChromeWindow',
            'tabId': tabId
        });
    }
    
    this.developerTabSql = function(item){
        _this.jQuery('.panel-body .tab').removeClass('active');
        _this.jQuery('.panel-body .tab.tab-sql').addClass('active');
        
        var toolsSql = new tools_sql;
        toolsSql.init(_this);
    }
    
    var _developerTabProfilerInitialised = false;
    var _developerTabMailInitialised = false;
    var _developerTabModelInitialised = false;
    
    this.developerTabMail = function(item){
        _this.jQuery('.panel-body .tab').removeClass('active');
        _this.jQuery('.panel-body .tab.tab-mail').addClass('active');
        
        if (_developerTabMailInitialised){
            return;
        }
        
        _developerTabMailInitialised = true;
        debugger;
        var toolsMail = new tools_mail;
        toolsMail.init(_this);
    }
    
    this.developerTabProfiler = function(item){
        _this.jQuery('.panel-body .tab').removeClass('active');
        _this.jQuery('.panel-body .tab.tab-profiler').addClass('active');
        
        if (_developerTabProfilerInitialised){
            return;
        }
        
        _developerTabProfilerInitialised = true;
        
        var toolsMail = new tools_profiler;
        toolsMail.init(_this);
    }
    
    this.developerTabModel = function(item){
        _this.jQuery('.panel-body .tab').removeClass('active');
        _this.jQuery('.panel-body .tab.tab-cron').addClass('active');
        
        if (_developerTabModelInitialised){
            return;
        }
        
        _developerTabModelInitialised = true;
        
        //var toolsMail = new tools_profiler;
        //toolsMail.init(_this);
    }
    
    this.developerLink = function(link, item){
        switch(link){
            case('sql'):
                _this.developerTabSql(item)
            break;
            case('mail'):
                _this.developerTabMail(item)
            break;
            case('profiler'):
                _this.developerTabProfiler(item)
            break;
            case('model'):
                _this.developerTabModel(item)
            break;
        }
    }
    
    this.initTags = function(devWindow){
        // Links
        aTags = devWindow.document.getElementsByTagName('a');
        
        jQuery(aTags).each(function(key, item){
            jQuery(item).on('click', function(e){
                e.preventDefault();
                var linkType = jQuery(this).attr('linktype');
                var extensionWindow  = jQuery(this).attr('extensionwindow');
                var link = jQuery(this).attr('href');
                
                if (linkType == 'developer'){
                    _this.developerLink(link, item);
                    return;
                }
                
                if (extensionWindow){
                    var params = {
                        'host':_this.getRootPath(_data.tab.url)
                    };
                    
                    var jsonString = jQuery.stringify(params);
                    link = link + '#' + jQuery.base64.encode(jsonString);
                }
                
                _this.openChromeWindow(link, linkType);
            });
        });
    }
    
    this.init = function(devWindow){
        _devWindow = devWindow;
        
        _this.initTags(devWindow);
        
        _this.collectData(function(data){
            _data = data;
            switch (data.state){
                case('unavaliable'):
                    _this.showWindowUnavaliable();
                    break;
                case('notinstalled'):
                    _this.showWindowInstallation();
                    break;
                case('avaliable'):
                    _this.showWindowDebugger(data);
                    break;
                case('update'):
                    _this.showWindowUpdate(data);
                    break;
            }
        })
    };
    
    this.collectData = function(func){
        chrome.extension.sendRequest({
            'method' : 'collectData'
        },func);
    }
};