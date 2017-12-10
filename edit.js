function setScreenshotUrl(url) {
  var image = document.getElementById('original');
  image.src = url;
  image.onload = function(){
    drawBackground()
  }
}

var ctx = null;
var canvas = null;
var shapes = new Array();
var isMouseDown = false;

function drawBackground() {
  canvas = document.getElementById('edit-canvas')
  image = document.getElementById("original")
  canvas.width = image.width
  canvas.height = image.height
  ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0)
}

// TODO(fberge): Figure out why I cannot paste to messenger with this, but I can paste if I select the dtop down 'copy image'
jQuery(function($){
  $('#copy').click(function() {
    console.log('Click!')
    var image = document.querySelector('#edit-canvas');
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


  
  $('#edit-canvas').mousedown(function (e) {
    // Record position
    addLine(adjustPosToCanvas([e.pageX, e.pageY]))
    isMouseDown = true
    draw()
  })
  
  $('#edit-canvas').mouseleave(function(e){
    isMouseDown = false;
  })
  $('#edit-canvas').mouseup(function (e) {
    isMouseDown = false
  })
  
  $('#edit-canvas').mousemove(function (e) {
    if (isMouseDown) {
      shapes[shapes.length - 1].addPos(adjustPosToCanvas([e.pageX, e.pageY]))
      draw()
    }
  })

  $('#shapes-list').on('click', 'li', function() {
    var index = $('#shapes-list li').index( this );
    removeShape(index)
  });

  function adjustPosToCanvas(pos) {
    var rect = canvas.getBoundingClientRect();
    x = pos[0] - rect.left
    y = pos[1] - rect.top
    return [x, y]
  }

  function addLine(startPos) {
    var dshape = document.getElementById('draw-shape').value;
    if (dshape == 'Ellipse') {
      shapes.push(new Ellipse({
        strokeStyle: 'blue',
        lineWidth: 4,
        canvas: canvas,
        startPos: startPos
      }));
    } else {
      shapes.push(new Pencil({
        strokeStyle: 'blue',
        lineWidth: 4,
        canvas: canvas,
        startPos: startPos
      }));
    }
    renderPanel()
  }

  function removeLine(index) {
    shapes.splice(index, 1)
    renderPanel()
    draw()
  }
  
  function renderPanel() {
    $('#shapes-list li').remove()
    shapes_list = $('#shapes-list')
    // Re-render the list.
    shapes.forEach(function(shape) {
      shapes_list.append("<li><a href='#'>[x] line</a></li>")
    })
  }
  
  function resetCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    image = document.getElementById("original")
    ctx.drawImage(image, 0, 0)
  }
  
  function draw() {
    resetCanvas()
    shapes.forEach(function(shape) {
      shape.draw()
    })
  }


  $('#upload').click(function () {
    GDocs.prototype.auth(true, function() {
      document.getElementById('edit-canvas').toBlob(function(blob) {
        blob.name = "Znip-" + new Date().toISOString().replace(/[:.]/g,"");
        GDocs.prototype.upload(blob, function(a) {
            resp = JSON.parse(a)
            chrome.storage.sync.get({
              sharing: 'me',
              domain_name: ""
            }, function(items) {
              var fileId = resp["id"]
              if (items.sharing == "anyone") {
                GDocs.prototype.permissioninsert(fileId, "anyone")
              } else if (items.sharing == "domain") {
                GDocs.prototype.permissioninsert(fileId, "domain", items.domain_name)
              }
              window.open(resp["alternateLink"], "_blank");
            });
          }, true);
      }, "image/jpeg", 0.75);
    });
  });


});




