var jcrop_api;

function cropend(e, s, c) {
  console.log(e,s,c);
  chrome.runtime.sendMessage({
    action: 'cropend', selection: c
  });
  jcrop_api.destroy()
}

jQuery(function($){
  if ($('#jcrop-wrapper').length > 0) {
    cropend(null, null, null)
    return;
  } else {
    $('body').append('<div id="jcrop-wrapper"></div>')
    $('#jcrop-wrapper').Jcrop({handles: []}, function() {
      jcrop_api = this
    });

    $('#jcrop-wrapper').one('cropend', cropend)
  }
});
