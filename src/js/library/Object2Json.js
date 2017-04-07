
function Object2Json(element, zoom) {

  let x = Number(element.offsetLeft / zoom),
    y = Number(element.offsetTop / zoom),
    w = Number(element.offsetWidth / zoom),
    h = Number(element.offsetHeight / zoom),
    obj = {
      boundingPoly: {
        vertices: [{
          x, y
        }, {
          x: (x+w), y
        }, {
          x: (x+w),
          y: (y+h)
        }, {
          x, y: (y+h)
        }]
      },
      description: element.innerText
    };
  return obj;
}

//52px 215px 121px 27px
export { Object2Json };
