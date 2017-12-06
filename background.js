function embedJcrop() {
    var page = chrome.extension.getBackgroundPage();
    chrome.tabs.insertCSS(null, {file: "content.css"}, function() {
      chrome.tabs.insertCSS(null, {file: "vendor/Jcrop.min.css"}, function() {
        chrome.tabs.executeScript(null, {file: "vendor/jquery-3.2.1.min.js"}, function() {
          chrome.tabs.executeScript(null, {file: "vendor/Jcrop.min.js"}, function() {
              chrome.tabs.executeScript(null, {file: "content_script.js"}, function() {
            });
          });
        });
      });
    });


  chrome.runtime.onMessage.addListener(function(req, sender) {
    chrome.tabs.captureVisibleTab(function(img) {
      cropImage(img, req.selection, function(cropped) {
        var targetId = null;
        chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
          if (tabId != targetId || changedProps.status != "complete")
            return;
    
          chrome.tabs.onUpdated.removeListener(listener);
    
          views = chrome.extension.getViews({type: 'tab', tabId: tabId})
          console.log(views)
          if (views.length >= 1) {
              views[0].setScreenshotUrl(cropped);
          }
        });
    
        var createProperties = {}
        createProperties.url = chrome.extension.getURL('edit.html?id=' + Math.random().toString(36).substr(2, 9));
        chrome.tabs.query({active: true}, function(tabs) {
          if (tabs.length > 0 && tabs[0].index) {
            console.log(tabs[0].index)
            createProperties.index = tabs[0].index + 1
          }
          chrome.tabs.create(createProperties, function(tab) {
            targetId = tab.id;
          });
        });
      });
    });
  });
}

function cropImage(img, s, done) {
  var r = devicePixelRatio
  var left = s.x * r
  var top = s.y * r
  var width = s.w * r
  var height = s.h * r

  canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.width = width
  canvas.height = height

  image = new Image()
  image.src = img
  image.onload = function(){
    ctx = canvas.getContext('2d');
    ctx.drawImage(image, left, top, width, height, 0, 0, width, height);
    var cropped = canvas.toDataURL('image/png')
    done(cropped)
  }
}


chrome.browserAction.onClicked.addListener(embedJcrop)
