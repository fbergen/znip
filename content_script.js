jQuery(function($){
  var jcrop_api;
  $('body').append('<div id="jcrop-wrapper"></div>')
  $('#jcrop-wrapper').Jcrop({}, function() {
    jcrop_api = this
  });

  $('#jcrop-wrapper').on('cropend',function(e,s,c){
    console.log(e,s,c);
    chrome.runtime.sendMessage({
      action: 'cropend', selection: c,
      scroll: {x: window.scrollX, y: window.scrollY}
    });
    jcrop_api.destroy()
  });

});
