function setScreenshotUrl(url) {
  var image = document.getElementById('original');
  image.src = url;
  image.onload = function(){
    drawBackground()
  }
}

var ctx = null;
var coords = new Array();
var isMouseDown = false;

function drawBackground() {
  canvas = document.getElementById('edit-canvas')
  image = document.getElementById("original")
  console.log(image)
  console.log(image.width)
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
    addLine()
    isMouseDown = true
    addCoord(e.pageX, e.pageY)
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
      addCoord(e.pageX, e.pageY)
      draw()
    }
  })

  $('#line-list').on('click', 'li', function() {
    var index = $('#line-list li').index( this );
    removeLine(index)
  });

  function addLine() {
    coords.push(new Array())
    renderPanel()
  }

  function removeLine(index) {
    coords.splice(index, 1)
    renderPanel()
    draw()
  }
  
  function renderPanel() {
    $('#line-list li').remove()
    lines = $('#line-list')
    // Re-render the lines.
    coords.forEach(function(line) {
      lines.append("<li><a href='#'>[x] line</a></li>")
    })
  }
  
  function addCoord(x, y) {
    coords[coords.length -1].push([x, y])
  }
  
  function resetCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    image = document.getElementById("original")
    ctx.drawImage(image, 0, 0)
  }
  
  function draw() {
    resetCanvas()
  
    ctx.strokeStyle = 'blue'
    ctx.lineWidth = 2
    coords.forEach(function(line) {
      if (line.length > 0) {
        ctx.beginPath()
        ctx.moveTo(line[0][0], line[0][1])
      }
      for (i = 1; i < line.length; i++) {
        ctx.lineTo(line[i][0], line[i][1])
      }
      ctx.stroke()
    })
  }
});
