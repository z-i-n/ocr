
function cumulativeOffset(element) {
  let top = 0,
    left = 0;
  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);

  return {
    top: top,
    left: left
  };
}

function mergeElement({target, source, history}) {
  history.history = Object.assign({}, {
    type: 'merge',
    elem: target,
    desc: target.innerText,
    minWidth: target.clientWidth,
    restore: source
  });

  target.style.minWidth = `${(target.clientWidth + source.clientWidth)}px`;
  target.innerText += source.innerText;
  source.setAttribute('data-show', false);
  source.style.display = 'none';
}

function mergeSeveral({x, y, w, h, items, history}) {
  let mergeKeys = [],
    mergeTargets = {};
  for (let item of items) {
    if (item.offsetTop >= y
      && item.offsetLeft >= x
      && (item.offsetLeft + item.offsetWidth) <= (x + w)
      && (item.offsetTop + item.offsetHeight) <= (y + h)) {
      mergeKeys.push(item.offsetLeft);
      mergeTargets[item.offsetLeft] = item;
    }
  }

  if (mergeKeys.length > 0) {
    // //console.log(mergeKeys);
    // mergeKeys.sort();
    // //console.log(mergeKeys);
    mergeKeys.reduce((prev, curr) => {
      mergeElement({target: mergeTargets[prev.toString()], source: mergeTargets[curr.toString()], history});
      return prev;
    });
  }
}

export { cumulativeOffset, mergeElement, mergeSeveral };
