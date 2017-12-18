var Shape = {}

Shape.Pencil = function Pencil(options) {
  this.strokeStyle = options.strokeStyle;
  this.canvas = options.canvas;

  this.lineWidth = options.lineWidth;
  this.coords = new Array();
  this.addPos(options.startPos)
};

Shape.Pencil.prototype.addPos = function(pos) {
  this.coords.push(pos)
};

Shape.Pencil.prototype.draw = function() {
  ctx = this.canvas.getContext('2d');
  ctx.strokeStyle = this.strokeStyle
  ctx.lineWidth = this.lineWidth
  coords = this.coords

  if (coords.length > 0) {
    ctx.beginPath()
    console.log(coords)
    ctx.moveTo(coords[0][0], coords[0][1])
  }
  for (i = 1; i < coords.length; i++) {
    ctx.lineTo(coords[i][0], coords[i][1])
  }
  ctx.stroke()
};

Shape.Ellipse = function Ellipse(options) {
  this.strokeStyle = options.strokeStyle;
  this.canvas = options.canvas;

  this.lineWidth = options.lineWidth;
  this.endPos = options.startPos
  this.startPos = options.startPos
};

Shape.Ellipse.prototype.addPos = function(pos) {
  this.endPos = pos
};

Shape.Ellipse.prototype.draw = function() {
  ctx = this.canvas.getContext('2d');
  ctx.strokeStyle = this.strokeStyle
  ctx.lineWidth = this.lineWidth
  ctx.beginPath();
  ctx.ellipse(
      this.startPos[0],
       this.startPos[1],
       Math.abs(this.startPos[0] - this.endPos[0]),
       Math.abs(this.startPos[1] - this.endPos[1]),
       0,
       0,
       2*Math.PI);
  ctx.stroke()
};

Shape.Arrow = function Arrow(options) {
  this.strokeStyle = options.strokeStyle;
  this.canvas = options.canvas;

  this.lineWidth = options.lineWidth;
  this.endPos = options.startPos
  this.startPos = options.startPos
};

Shape.Arrow.prototype.addPos = function(pos) {
  this.endPos = pos
};

Shape.Arrow.prototype.draw = function() {
  ctx = this.canvas.getContext('2d');
  ctx.strokeStyle = this.strokeStyle
  ctx.lineWidth = this.lineWidth
  ctx.beginPath();

  s = this.startPos;
  e = this.endPos;
  ctx.moveTo(s[0], s[1])
  ctx.lineTo(e[0], e[1])
  ctx.stroke()

  arr = arrowhead(s, e)
  ctx.moveTo(e[0], e[1])
  ctx.lineTo(arr[0][0], arr[0][1])

  ctx.moveTo(e[0], e[1])
  ctx.lineTo(arr[1][0], arr[1][1])
  ctx.stroke()
};


function length(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
}

function arrowhead(a, b) {
  h = 20
  w = 10
  u = [(b[0] - a[0])/length(a,b), (b[1] - a[1])/length(a,b)]
  v = [-u[1], u[0]]

  v1 = [b[0] - h*u[0] + w*v[0],
        b[1] - h*u[1] + w*v[1]]
  v2 = [b[0] - h*u[0] - w*v[0],
        b[1] - h*u[1] - w*v[1]]
  return [v1, v2]
}


