jQuery(function($){
  $('html').Jcrop();
});


$('html').on('cropend',function(e,s,c){
  console.log(e,s,c);
  chrome.runtime.sendMessage({
    action: 'cropend', selection: c,
		scroll: {x: window.scrollX, y: window.scrollY}
  });
});
