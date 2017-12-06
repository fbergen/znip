function setScreenshotUrl(id, url) {
  document.getElementById('target'+id).src = url;
}

// TODO(fberge): Load editor for annotating images.
jQuery(function($){
  $('#copy').click(function() {
    console.log('Click!')
    var image = document.querySelector('#target1');
    // Remove all ranges before, otherwise this is a noop.
    window.getSelection().removeAllRanges();
    var range = document.createRange();
    range.selectNode(image);
    window.getSelection().addRange(range);

    // Issue the copy command.
    document.execCommand('copy');

    // Clean up after us.
    window.getSelection().removeAllRanges();
  });
});
