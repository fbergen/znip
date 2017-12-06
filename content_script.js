var jcrop_api;

jQuery(function($){
  $('body').append('<div id="jcrop-wrapper"></div>')
  $('#jcrop-wrapper').Jcrop({handles: []}, function() {
    jcrop_api = this
  });

  $('#jcrop-wrapper').on('cropend',function(e,s,c){
    console.log(e,s,c);
    chrome.runtime.sendMessage({
      action: 'cropend', selection: c
    });
    jcrop_api.destroy()
  });

});
