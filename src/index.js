let fabric = require('fabric').fabric;


var canvas = new fabric.Canvas('c', {
  backgroundColor: 'rgb(100,100,200)',
  selectionColor: 'blue',
  selectionLineWidth: 2,
  width: 500,
  height: 400
  // ...
});

// create a rectangle object
var rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 100,
  height: 100
});

window.canvas = canvas;
window.rect = rect;

// "add" rectangle onto canvas
canvas.add(rect);
