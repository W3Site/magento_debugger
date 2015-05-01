/**
 * © Tereta Alexander (www.w3site.org), 2014-2015yy
 * All rights reserved.
 */

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
            jQuery(listItem).find('.profiler_url').attr('title', value.url);
            jQuery(listItem).attr('profiler_name', value.key)
            
            if (boolTrigger){
                jQuery(listItem).addClass('gray_row');
            }
            
            var insertAfter = _parent.jQuery('#profiler-content-table .template');
            jQuery(listItem).insertAfter(insertAfter);
            jQuery(listItem).find('.profiler_url_td, .profiler_time').on('click', _this.clickListItem);
            jQuery(listItem).find('input.remove').on('click', function(){
                var profilerName = jQuery(this).parent().parent().attr('profiler_name');
                
                _parent.ajax({
                    'url' : _parent.getRootPath(_data.tab.url) + '/?magento_debug=profiler&magento_debug_action=removedata&magento_debug_profiler_key=' + profilerName
                }, function(data){
                    _this.getList();
                });
            });
            
            if (boolTrigger){
                boolTrigger = false;
            }
            else{
                boolTrigger = true;
            }
        });
        
        _parent.jQuery('#profilers_reload').on('click', _this.getList);
        _parent.jQuery('#profilers_clear').on('click', function(){
            _parent.ajax({
                'url' : _parent.getRootPath(_data.tab.url) + '/?magento_debug=profiler&magento_debug_action=removedata&magento_debug_profiler_key=whole'
            }, function(data){
                _this.getList();
            });
        });
    }
    
    this.clickListItem = function(e){
        var profilerName = jQuery(this).parent().attr('profiler_name');
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
            jQuery(dataItem).find('.profiler_name').attr('title', value.name);
            jQuery(dataItem).find('.profiler_sum_time').text(value.sum);
            jQuery(dataItem).find('.profiler_count').text(value.count);
            jQuery(dataItem).find('.profiler_realmem').text(value.realmem);
            jQuery(dataItem).find('.profiler_emalloc').text(value.emalloc);
            
            if (boolTrigger){
                html = html + '<tr class="gray_row">' + dataItem.html() + '</tr>';
            }
            else{
                html = html + '<tr>' + dataItem.html() + '</tr>';
            }
            
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
        _parent.ajax({
            'url' : _parent.getRootPath(_data.tab.url) + '/?magento_debug=profiler&magento_debug_action=getdata&magento_debug_profiler_key=' + key
        }, function(data){
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
    }
}
