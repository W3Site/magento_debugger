/**
 * © Tereta Alexander (www.w3site.org), 2014-2015yy
 * All rights reserved.
 */
var tools_mail = function(){
    var _this = this;
    var _templates = {};
    var _parent = null;
    var _data = null;
    var _loadedList = new Array();
    
    this.showList = function(list){
        if (typeof list == 'undefined'){
            list = _loadedList;
        }
        
        _parent.jQuery('#maillist-content-table-wrapper').html(_templates.listTable);
        
        boolTrigger = false;
        jQuery(list).each(function(key, value){
            var listItem = _templates.listItem.clone();
            jQuery(listItem).removeClass('template');
            jQuery(listItem).find('.column_subject').text(value.email_subject);
            jQuery(listItem).find('.column_from').text(value.email_from);
            jQuery(listItem).find('.column_to').text(value.email_to);
            jQuery(listItem).find('.column_time').text(value.datetime);
            jQuery(listItem).find('.column_template_id').text(value.template_id);
            jQuery(listItem).find('.column_template_file').text(value.template_file);
            jQuery(listItem).find('input[name=show_body]').attr('listkey', key);
            jQuery(listItem).find('input[name=show_trace]').attr('listkey', key);
            
            if (boolTrigger){
                jQuery(listItem).addClass('gray_row');
            }
            
            var insertAfter = _parent.jQuery('#maillist-content-table .template');
            jQuery(listItem).insertAfter(insertAfter);
            
            if (boolTrigger){
                boolTrigger = false;
            }
            else{
                boolTrigger = true;
            }
        })
        
        _parent.jQuery('#maillist-content-table input[name=show_trace]').on('click', function(){
            var emailData = _loadedList[jQuery(this).attr('listkey')];
            var trace = emailData.backtrace;
            
            var windowOpend = window.open("", "", 'menubar=no,location=no,status=no,titlebar=no');
            body = '<html><html><title>Email backtrace</title></html><body><pre>' + trace + '</pre></body></html>';
            jQuery(windowOpend.document.body).html(body);
        })
        
        _parent.jQuery('#maillist-content-table input[name=show_body]').on('click', function(){
            var emailData = _loadedList[jQuery(this).attr('listkey')];
            var body = emailData.email_body;
            var windowOpend = window.open("", "", 'menubar=no,location=no,status=no,titlebar=no');
            if (emailData.email_is_plan){
                body = '<html><html><title>' + emailData.email_subject + '</title></html><body><pre>' + body + '</pre></body></html>';
                jQuery(windowOpend.document.body).html(body);
            }
            else{
                body = '<html><html><title>' + emailData.email_subject + '</title></html>' + body + '</html>';
                jQuery(windowOpend.document.body).html(body);
            }
        })
    }
    
    this.init = function(parent){
        _parent = parent;
        _data = parent.getData();
        
        var listTemplate = _parent.jQuery('#maillist-content-table-wrapper');
        var listItemTemplate = _parent.jQuery('#maillist-content-table .template');
        _templates.listTable = listTemplate.html();
        _templates.listItem = listItemTemplate.clone();
        
        _parent.jQuery('input[name=clear_mails]').on('click', function(){
            _parent.ajax({
                'url' : _parent.getRootPath(_data.tab.url) + '?magento_debug=maillist&magento_debug_action=clearlist'
            }, function(data){
                _this.showList(_loadedList = new Array());
            });
        });
        
        _parent.jQuery('input[name=reload_mails]').on('click', function(){
            _parent.ajax({
                'url' : _parent.getRootPath(_data.tab.url) + '?magento_debug=maillist&magento_debug_action=getlist',
                'dataType' : 'json'
            }, function(list){
                _loadedList = JSON.parse(list);
                _this.showList(_loadedList);
            });
        });
        
        _parent.ajax({
            'url' : _parent.getRootPath(_data.tab.url) + '?magento_debug=maillist&magento_debug_action=getlist',
            'dataType' : 'json'
        }, function(list){
            _loadedList = JSON.parse(list);
            _this.showList(_loadedList);
        });
    }
}

var tools_profiler = function(){
    var _this = this;
    var _templates = {};
    var _parent = null;
    var _data = null;
    var _loadedList = new Array();
    
    this.showList = function(list){
        if (typeof list == 'undefined'){
            list = _loadedList;
        }
        
        _parent.jQuery('#profiler-content-table-wrapper').html(_templates.listTable);
        boolTrigger = false;
        
        jQuery(list).each(function(key, value){
            var listItem = _templates.listItem.clone();
            jQuery(listItem).removeClass('template');
            jQuery(listItem).find('.profiler_time').text(value.time);
            jQuery(listItem).find('.profiler_url').text(value.url);
            jQuery(listItem).attr('profiler_name', value.key)
            
            if (boolTrigger){
                jQuery(listItem).addClass('gray_row');
            }
            
            var insertAfter = _parent.jQuery('#profiler-content-table .template');
            jQuery(listItem).insertAfter(insertAfter);
            jQuery(listItem).on('click', _this.clickListItem);
            
            if (boolTrigger){
                boolTrigger = false;
            }
            else{
                boolTrigger = true;
            }
        })
    }
    
    this.clickListItem = function(e){
        var profilerName = jQuery(this).attr('profiler_name');
        _this.getData(profilerName);
    }
    
    this.showData = function(data){
        if (typeof data == 'undefined'){
            data = _loadedData;
        }
        
        _parent.jQuery('#profiler-data-wrapper').html(_templates.dataTable);
        boolTrigger = false;
        
        var html = '';
        
        jQuery(data).each(function(key, value){
            var dataItem = _templates.dataItem.clone();
            jQuery(dataItem).removeClass('template');
            jQuery(dataItem).find('.profiler_name').text(value.name);
            jQuery(dataItem).find('.profiler_sum_time').text(value.sum);
            jQuery(dataItem).find('.profiler_count').text(value.count);
            jQuery(dataItem).find('.profiler_realmem').text(value.realmem);
            jQuery(dataItem).find('.profiler_emalloc').text(value.emalloc);
            
            if (boolTrigger){
                jQuery(dataItem).addClass('gray_row');
            }
            
            html = html + '<tr>' + dataItem.html() + '</tr>';
            //var insertAfter = _parent.jQuery('#profiler-data .template');
            //jQuery(dataItem).insertAfter(insertAfter);
            
            if (boolTrigger){
                boolTrigger = false;
            }
            else{
                boolTrigger = true;
            }
        });
        
        var insertAfter = _parent.jQuery('#profiler-data .template');
        jQuery(html).insertAfter(insertAfter);
    };
    
    this.getData = function(key){
        debugger;
        _parent.ajax({
            'url' : _parent.getRootPath(_data.tab.url) + '/?magento_debug=profiler&magento_debug_action=getdata&magento_debug_profiler_key=' + key
        }, function(data){
            debugger;
            _loadedData = JSON.parse(data);
            _this.showData(_loadedData);
        });
    }
    
    this.getList = function(){
        _parent.ajax({
            'url' : _parent.getRootPath(_data.tab.url) + '/?magento_debug=profiler&magento_debug_action=getlist'
        }, function(list){
            _loadedList = JSON.parse(list);
            _this.showList(_loadedList);
        });
    }
    
    this.init = function(parent){
        _parent = parent;
        _data = parent.getData();
        
        var listTemplate = _parent.jQuery('#profiler-content-table-wrapper');
        var listItemTemplate = _parent.jQuery('#profiler-content-table .template');
        _templates.listTable = listTemplate.html();
        _templates.listItem = listItemTemplate.clone();
        
        var dataTemplate = _parent.jQuery('#profiler-data-wrapper');
        var dataItemTemplate = _parent.jQuery('#profiler-data .template');
        _templates.dataTable = dataTemplate.html();
        _templates.dataItem = dataItemTemplate.clone();

        _this.getList();
        //setInterval(_this.getList, 5000);
    }
}

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
            
            _this.jQuery('#debug_blocks').prop('checked', false);
            _this.jQuery('input[name=debug_mails]').prop('checked', false);
            _this.jQuery('input[name=debug_mysql][value=no]').prop('checked', true);
            _this.jQuery('input[name=debug_mysql_value]').val('0.5');
            _this.jQuery('#debug_mysql_trace').prop('checked', false);
            _this.jQuery('input[name=debug_password_admin]').prop('checked', false);
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
    
    this.developerTabMail = function(item){
        _this.jQuery('.panel-body .tab').removeClass('active');
        _this.jQuery('.panel-body .tab.tab-mail').addClass('active');
        
        if (_developerTabMailInitialised){
            return;
        }
        
        _developerTabMailInitialised = true;
        
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