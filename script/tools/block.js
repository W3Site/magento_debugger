/**
 * © Tereta Alexander (www.w3site.org), 2014-2015yy
 * All rights reserved.
 */
var tools_block = function(){
    var _this = this;
    var _parent = null;
    var _data = null;
    var _blocks = {};
    var _blockInfo = new Array();
    var _templates = {};
    
    this.init = function(parent){
        _parent = parent;
        var listTemplate = _parent.jQuery('#block-content-table-wrapper');
        var listItemTemplate = _parent.jQuery('#block-content-table-wrapper .template');
        _templates.listTable = listTemplate.html();
        _templates.listItem = listItemTemplate.clone();

        _data = parent.getData();

        _parent.getTabData(_data.tab.id, {'action' : 'gethtml'}, _this.parseBlocks)
        
        _this.determineReload();
    }
    
    this.determineReload = function(){
        chrome.extension.sendRequest({
            'method' : 'determineReload'
        }, function(){
            _this.determineReload();
            _parent.getTabData(_data.tab.id, {'action' : 'gethtml'}, _this.parseBlocks)
        });
    }
    
    this.parseBlocks = function(data){
        var lastPosition = 0;
        var newPosition = 0;
        var string = '';
        var blockInfoParese = new Array();
        var tmp;
        debugger;
        
        _blockInfo = new Array();
        
        while (lastPosition != -1){
            var blockInfoItem = new Object();
            newPosition = data.indexOf('<!-- + Block ', lastPosition);
            
            if (newPosition == -1){
                break;
            }
            
            endPosition = data.indexOf('-->', newPosition);
            string = data.substring(newPosition + 7, endPosition);
            
            blockInfoParese = string.split("\n");
            for(key in blockInfoParese){
                tmp = blockInfoParese[key].trim();
                
                if (tmp.substring(0, 6) == 'Block '){
                    blockInfoItem.id = tmp.substring(6);
                }
                else if (tmp.substring(0, 7) == 'Class: '){
                    blockInfoItem.className = tmp.substring(7, tmp.length - 1);
                }
                else if (tmp.substring(0, 16) == 'Name in layout: '){
                    blockInfoItem.layoutName = tmp.substring(16, tmp.length - 1);
                }
                else if (tmp.substring(0, 6) == 'File: '){
                    blockInfoItem.templateFile = tmp.substring(6, tmp.length - 1);
                }
            }
            
            _blockInfo.push(blockInfoItem);
            
            if (newPosition != -1){
                lastPosition = newPosition + 1;
            }
            else{
                lastPosition = -1;
            }
        }
        
        _parent.jQuery('#block-content-table-wrapper').html(_templates.listTable);
        
        boolTrigger = false;
        jQuery(_blockInfo).each(function(key, value){
            var listItem = _templates.listItem.clone();
            jQuery(listItem).removeClass('template');
            jQuery(listItem).find('.block-identifier').text(value.id);
            jQuery(listItem).find('.block-class-name').text(value.className);
            jQuery(listItem).find('.block-name-in-layout').text(value.layoutName);
            jQuery(listItem).find('.block-template-file').text(value.templateFile);
            
            if (boolTrigger){
                jQuery(listItem).addClass('gray_row');
            }
            
            var insertAfter = _parent.jQuery('#block-data .template');
            jQuery(listItem).insertAfter(insertAfter);
            
            if (boolTrigger){
                boolTrigger = false;
            }
            else{
                boolTrigger = true;
            }
        });
    }
}