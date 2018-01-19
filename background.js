

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


  if (!chrome.runtime.onMessage.hasListeners()) {
    chrome.runtime.onMessage.addListener(function onMessageListener(req, sender) {
      chrome.runtime.onMessage.removeListener(onMessageListener);

      chrome.tabs.captureVisibleTab(function(img) {
        cropImage(img, req.selection, function(cropped) {
          var targetId = null;
          var viewTabUrl = chrome.extension.getURL('edit.html?id=' + Math.random().toString(36).substr(2, 9));
          chrome.tabs.onUpdated.addListener(function onUpdatedListener(tabId, changedProps) {
            if (tabId != targetId || changedProps.status != "complete") {
              return;
            }

            chrome.tabs.onUpdated.removeListener(onUpdatedListener);

            views = chrome.extension.getViews({type: 'tab', tabId: tabId})
            console.log(views)
            for (var i = 0; i < views.length; i++) {
              var view = views[i]
              if (view.location.href == viewTabUrl && !view.imageAlreadySet) {
                view.setScreenshotUrl(cropped);
                view.processed = true
              }
            }
          });

          var createProperties = {}
          createProperties.url = viewTabUrl
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
}

function cropImage(img, s, done) {
  var r = devicePixelRatio
  image = new Image()
  image.src = img
  image.onload = function(){
    canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    // Don't scale with devicePixelRatio for the target image.
    var left = ((s && s.x) || 0) * r
    var top = ((s && s.y) || 0) * r
    var width = ((s && s.w * r) || image.width)
    var height = ((s && s.h * r) || image.height)

    canvas.width = width / r
    canvas.height = height / r

    console.log("crop:", left, top, width, height)
    console.log("destination:", 0, 0, canvas.width, canvas.height)
    console.log("devicePixelRatio: ", r)
    ctx = canvas.getContext('2d');
    ctx.drawImage(image,
                  left, top, width, height,
                  0, 0, canvas.width, canvas.height);
    var cropped = canvas.toDataURL('image/png')
    done(cropped)
  }
}


chrome.browserAction.onClicked.addListener(embedJcrop)
