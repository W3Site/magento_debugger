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
    
    this.init = function(parent){
        _parent = parent;
        _data = parent.getData();
        
        _parent.getTabData(_data.tab.id, {'action' : 'gethtml'}, _this.parseBlocks)
    }
    
    this.parseBlocks = function(data){
        var lastPosition = 0;
        var newPosition = 0;
        var string = '';
        var blockInfoItem = new Object();
        var blockInfoParese = new Array();
        var tmp;
        
        while (lastPosition != -1){
            newPosition = data.indexOf('<!-- + Block ', lastPosition);
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
        
        debugger;
    }
}