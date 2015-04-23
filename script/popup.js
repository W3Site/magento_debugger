/**
 * © Tereta Alexander (www.w3site.org), 2014-2015yy
 * All rights reserved.
 */
popupWindow = function(){
    var _this = this;
    var _data = {
        tab : {},
        cookies : {}
    };
    
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
    
    this.initOptions = function(){
        // Reload page
        jQuery('#reload_page').on('click', function(){
            chrome.tabs.reload(_data.tab.id);
        });
        
        // Backend config
        jQuery('#backend_config').on('click', function(){
            chrome.tabs.create({url: _this.getRootPath(_data.tab.url) + '/?magento_debug=configure'});
            chrome.tabs.reload(_data.tab.id);
        });
        
        // Clear all
        jQuery('#clear_all').on('click', function(){
            chrome.cookies.set({url: _this.getRootPath(_data.tab.url), name: 'magento_debug_blocks', path: '/', value: 'no'});
            chrome.cookies.set({url: _this.getRootPath(_data.tab.url), name: 'magento_debug_mysql', path: '/', value: 'no'});
            chrome.cookies.set({url: _this.getRootPath(_data.tab.url), name: 'magento_debug_mysql_trace', path: '/', value: 'no'});
            chrome.cookies.set({url: _this.getRootPath(_data.tab.url), name: 'magento_debug_mysql_value', path: '/', value: '0.5'});
            
            jQuery('#debug_blocks').prop('checked', false);
            jQuery('input[name=debug_mysql][value=no]').prop('checked', true);
            jQuery('input[name=debug_mysql_value]').val('0.5');
            jQuery('#debug_mysql_trace').prop('checked', false);
        });
        
        // Allow all passwords for admin
        if (_data.cookies.magento_debug_password_admin == 'yes'){
            jQuery('input[name=debug_password_admin]').prop('checked', true);
        }
        
        jQuery('input[name=debug_password_admin]').on('change', function(){
            if (jQuery('input[name=debug_password_admin]').is(':checked')){
                chrome.cookies.set({url: _this.getRootPath(_data.tab.url), name: 'magento_debug_password_admin', path: '/', value: 'yes'});
            }
            else{
                chrome.cookies.set({url: _this.getRootPath(_data.tab.url), name: 'magento_debug_password_admin', path: '/', value: 'no'});
            }
        });
        
        // Debug blocks
        if (_data.cookies.magento_debug_blocks == 'yes'){
            jQuery('#debug_blocks').prop('checked', true);
        }
        
        jQuery('#debug_blocks').on('change', function(){
            if (jQuery('#debug_blocks').is(':checked')){
                chrome.cookies.set({url: _this.getRootPath(_data.tab.url), name: 'magento_debug_blocks', path: '/', value: 'yes'});
            }
            else{
                chrome.cookies.set({url: _this.getRootPath(_data.tab.url), name: 'magento_debug_blocks', path: '/', value: 'no'});
            }
        });
        
        // Debug mails
        if (_data.cookies.magento_debug_mails == 'yes'){
            jQuery('input[name=debug_mails]').prop('checked', true);
        }
        
        jQuery('input[name=debug_mails]').on('change', function(){
            if (jQuery('input[name=debug_mails]').is(':checked')){
                chrome.cookies.set({url: _this.getRootPath(_data.tab.url), name: 'magento_debug_mails', path: '/', value: 'yes'});
            }
            else{
                chrome.cookies.set({url: _this.getRootPath(_data.tab.url), name: 'magento_debug_mails', path: '/', value: 'no'});
            }
        });
        
        // Debug mysql
        if (_data.cookies.magento_debug_mysql == 'no'){
            jQuery('input[name=debug_mysql][value=no]').prop('checked', true);
        }
        
        if (_data.cookies.magento_debug_mysql == 'all'){
            jQuery('input[name=debug_mysql][value=all]').prop('checked', true);
        }
        
        if (_data.cookies.magento_debug_mysql == 'value'){
            jQuery('input[name=debug_mysql][value=value]').prop('checked', true);
        }
        
        if (_data.cookies.magento_debug_mysql_value){
            jQuery('input[name=debug_mysql_value]').val(_data.cookies.magento_debug_mysql_value);
        }

        jQuery('input[name=debug_mysql_value]').on('keyup', function(){
            var value = jQuery('input[name=debug_mysql_value]').val();
            chrome.cookies.set({'url': _this.getRootPath(_data.tab.url), 'name': 'magento_debug_mysql_value', 'path': '/', 'value': value});
        });
        
        jQuery('input[name=debug_mysql]').on('change', function(){
            var debugMysql = jQuery('input[name=debug_mysql]:checked').val();
            
            chrome.cookies.set({'url': _this.getRootPath(_data.tab.url), 'name': 'magento_debug_mysql', 'path': '/', 'value': debugMysql});
        });

        if (_data.cookies.magento_debug_mysql_trace == 'yes'){
            jQuery('#debug_mysql_trace').prop('checked', true);
        }
        
        jQuery('#debug_mysql_trace').on('change', function(){
            if (jQuery('#debug_mysql_trace').is(':checked')){
                chrome.cookies.set({url: _this.getRootPath(_data.tab.url), name: 'magento_debug_mysql_trace', path: '/', value: 'yes'});
            }
            else{
                chrome.cookies.set({url: _this.getRootPath(_data.tab.url), name: 'magento_debug_mysql_trace', path: '/', value: 'no'});
            }
        });
        
        // Debug model method
        if (_data.cookies.magento_debug_model){
            jQuery('input[name=debug_model]').val(_data.cookies.magento_debug_model);
        }
        
        jQuery('input[name=debug_model]').on('keyup', function(){
            chrome.cookies.set({url: _this.getRootPath(_data.tab.url), name: 'magento_debug_model', path: '/', value: jQuery('input[name=debug_model]').val()});
        });
        
        jQuery('input[name=debug_model_run]').on('click', function(){
            var value = jQuery('input[name=debug_model]').val();
            var host = _this.getRootPath(_data.tab.url);
            
            var params = {
                'host':_this.getRootPath(_data.tab.url)
            };
            
            var jsonString = jQuery.stringify(params);
            var link = 'window.html?magento_debug=model&magento_debug_model_method=' + value + '#' + jQuery.base64.encode(jsonString);

            chrome.windows.create({
                url: chrome.extension.getURL(link),
                type: 'popup'
            });
        });
    }
    
    this.showWindowDebugger = function(){
        jQuery('.debug_window').hide();
        jQuery('.debug_form').show();
    }
    
    this.showWindowUpdate = function(options){
        var version = chrome.runtime.getManifest().version;
        var backendVersion = options.backendVersion;
        var backend_extension_link = 'https://github.com/w3site/magento_debugger_backend/archive/version-' + version + '.zip';
        jQuery('.debug_update .current_version').html(version);
        jQuery('.debug_update .backend_version').html(backendVersion);
        jQuery('.debug_update .download_extension_link').attr('href', backend_extension_link);
        
        jQuery('.debug_window').hide();
        jQuery('.debug_update').show();
    }
    
    this.showWindowInstallation = function(){
        var version = chrome.runtime.getManifest().version;
        var backend_extension_link = 'https://github.com/w3site/magento_debugger_backend/archive/version-' + version + '.zip';
        jQuery('.debug_install .current_version').html(version);
        jQuery('.debug_install .download_extension_link').attr('href', backend_extension_link);
        jQuery('.debug_window').hide();
        jQuery('.debug_install').show();
    }
    
    this.showWindowDocumentation = function(){
        jQuery('.debug_window').hide();
        jQuery('.debug_unuseble').show();
    }
    
    this.init = function(){
        // Links
        jQuery('a').each(function(key, item){
            jQuery(item).on('click', function(){
                var linkType = jQuery(this).attr('linktype');
                var extensionWindow  = jQuery(this).attr('extensionwindow');
                var link = jQuery(this).attr('href');
                if (extensionWindow){
                    var params = {
                        'host':_this.getRootPath(_data.tab.url)
                    };
                    
                    var jsonString = jQuery.stringify(params);
                    link = link + '#' + jQuery.base64.encode(jsonString);
                }
                
                
                if (linkType == 'download'){
                    chrome.downloads.download({
                        'url' : link
                    });
                }
                else if (linkType == 'popup'){
                    chrome.windows.create({
                        'url': link,
                        'type': 'popup',
                        'width': 850
                    });
                }
                else{
                    chrome.tabs.create({'url': link});
                }
            });
        });
        
        // Data retreiving and options set
        chrome.tabs.getSelected(null, function(tab) {
            _data.tab = tab;
            
            if (tab.url.substr(0, 7) != 'http://' && tab.url.substr(0, 8) != 'https://'){
                _this.showWindowDocumentation();
                return;
            }
            
            var version = chrome.runtime.getManifest().version;
            
            jQuery.ajax({
                url: tab.url + '?magento_debug_info=yes&current_version=' + version,
                dataType: 'json'
            }).done(function(json){
                var version = chrome.runtime.getManifest().version;
                
                if (typeof json.version == 'string' && json.version != version){
                    _this.showWindowUpdate({
                        'backendVersion' : json.version
                    });
                }
                else if (typeof json.version == 'string' && json.version == version){
                    _this.showWindowDebugger();
                    
                    chrome.cookies.getAll({url: tab.url}, function(cookies){
                        for(var f=0; f<cookies.length; f++){
                            _data.cookies[cookies[f].name] = cookies[f].value;
                        }
                        
                        _this.initOptions();
                    });
                }
                else{
                    _this.showWindowInstallation();
                }
            }).fail(function(){
                _this.showWindowInstallation();
            });
        });
    }
}

popup = new popupWindow;
jQuery(document).ready(popup.init);