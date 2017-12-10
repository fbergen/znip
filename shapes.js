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

