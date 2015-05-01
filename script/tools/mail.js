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

    }
    
    this.init = function(parent){
        _parent = parent;
        _data = parent.getData();
        
        var listTemplate = _parent.jQuery('#maillist-content-table-wrapper');
        var listItemTemplate = _parent.jQuery('#maillist-content-table .template');
        _templates.listTable = listTemplate.html();
        _templates.listItem = listItemTemplate.clone();
        
        _parent.ajax({
            'url' : _parent.getRootPath(_data.tab.url) + '?magento_debug=maillist&magento_debug_action=getlist',
            'dataType' : 'json'
        }, function(list){
            _loadedList = JSON.parse(list);
            _this.showList(_loadedList);
        });
    };
};