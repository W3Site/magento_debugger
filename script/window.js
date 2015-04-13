/**
 * © Tereta Alexander (www.w3site.org), 2014-2015yy
 * All rights reserved.
 */

mainWindow = function(){
    var _this = this;
    var _data = {};
    
    this.getData = function(){
        return _data;
    }
    
    this.init = function(){
        var searchLine = window.location.search;
        var searchValuesStrings = searchLine.substring(1).split("&");
        var searchValues = new Object();
        for (hf = 0; hf < searchValuesStrings.length; hf++){
            searchValueSplit = searchValuesStrings[hf].split('=');
            searchValues[searchValueSplit[0]] = searchValueSplit[1];
        }
        
        _data.queryValues = searchValues;
        var jsonDataString = jQuery.base64.decode(location.hash.substring(1));
        _data.extension = jQuery.parseJSON(jsonDataString);
        
        switch (searchValues['magento_debug']){
            case('model'):
                jQuery('#heading').html('Cron observer or model methods debug.');
                jQuery.getScript(window.location.origin + '/script/window/cron.js').done(function(){
                    jQuery('.content').hide();
                    jQuery('#cron-content').show();
                    var mainWindowCronObject = new mainWindowCron;
                    mainWindowCronObject.init(_this);
                });
                break;
            case('maillist'):
                jQuery('#heading').html('Mail list.');
                jQuery.getScript(window.location.origin + '/script/window/mail.js').done(function(){
                    jQuery('.content').hide();
                    jQuery('#maillist-content').show();
                    var mainWindowMailObject = new mainWindowMail;
                    mainWindowMailObject.mailListInit(_this);
                });
                break;
            case('mysql'):
                jQuery('#heading').html('Mysql debug.');
                jQuery.getScript(window.location.origin + '/script/window/mysql.js').done(function(){
                    jQuery('.content').hide();
                    jQuery('#mysql-content').show();
                    var mainWindowMysqlObject = new mainWindowMysql;
                    mainWindowMysqlObject.init(_this);
                });
                break;
        }
    }
}

mainWindow = new mainWindow;
jQuery(document).ready(mainWindow.init);