import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import DomHistory from '../../library/DomHistory';
import { cumulativeOffset, mergeElement, mergeSeveral } from '../../library/Helper';
import { Object2Json } from '../../library/Object2Json';
import { doneSave, saveJsonData } from '../../actions';

class Desc extends Component {

  constructor(...args) {
    super(...args);
    this.handleClick = this.handleClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleWrapClick = this.handleWrapClick.bind(this);
    this.keyHandler = this.keyHandler.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.editHistory = new DomHistory();
    this.changeZoom = false;
    console.log('DESC constructor');
  }

  getStyle(vertices, desc) {
    let maxX = Number.NEGATIVE_INFINITY,
      minX = Number.POSITIVE_INFINITY,
      maxY = Number.NEGATIVE_INFINITY,
      minY = Number.POSITIVE_INFINITY,
      zoom = this.props.zoom.value;
    vertices.map((o, i) => {
      minX = Math.min(o.x || 0, minX);
      maxX = Math.max(o.x || 0, maxX);
      minY = Math.min(o.y || 0, minY);
      maxY = Math.max(o.y || 0, maxY);
    });

    return {
      position: 'absolute',
      zIndex: 10,
      border: '1px solid',
      color: 'red',
      fontSize: (((maxX-minX)/desc.length)) * zoom,
      top: (minY) * zoom,
      left: (minX) * zoom,
      minWidth: `${(maxX-minX) * zoom}px`,
      minHeight: `${(maxY-minY) * zoom}px`
    };
  }

  handleWrapClick(e) {
    if (this.prevElem) {
      this.prevElem.style.backgroundColor = '';
      this.prevElem.style.transition = '';
      this.prevElem = null;
    }
  }

  //before, after value check
  handleMouseDown(e) {
    let x, y;
    if (e.target.id && e.target.id == 'wrap-item') {
      e.stopPropagation();
      x = e.pageX + this.props.scrollBox.scrollLeft;
      y = e.pageY + this.props.scrollBox.scrollTop;
      this.startX = x;
      this.startY = y;
      this.selectBox.style.top = `${y-this.wrapOffset.top}px`;
      this.selectBox.style.left = `${x-this.wrapOffset.left}px`;
      this.selectBox.style.display = '';
    }
  }

  handleMouseMove(e) {
    //console.log(this.selectBox.style.width);
    let x = e.pageX + this.props.scrollBox.scrollLeft,
      y = e.pageY + this.props.scrollBox.scrollTop;
    if (this.selectBox.style.display == '') {
      e.stopPropagation();
      if (this.startX > x) {
        this.selectBox.style.left = `${x-this.wrapOffset.left}px`;
        this.selectBox.style.width = `${(this.startX-this.wrapOffset.left) - (x-this.wrapOffset.left)}px`;
      } else {
        this.selectBox.style.width = `${(x-this.wrapOffset.left)-this.selectBox.offsetLeft}px`;
      }

      if (this.startY > y) {
        this.selectBox.style.top = `${y-this.wrapOffset.top}px`;
        this.selectBox.style.height = `${(this.startY-this.wrapOffset.top) - (y-this.wrapOffset.top)}px`;
      } else {
        this.selectBox.style.height = `${(y-this.wrapOffset.top)-this.selectBox.offsetTop}px`;
      }
    }
  }

  handleMouseUp(e) {
    if (this.selectBox.style.display == '') {
      e.stopPropagation();
      let items = this.wrapBox.querySelectorAll(`div[data-show='true']`);
      mergeSeveral({x: this.selectBox.offsetLeft, y: this.selectBox.offsetTop, w: this.selectBox.offsetWidth, h: this.selectBox.offsetHeight, items, history: this.editHistory});
      this.selectBox.style.display = 'none';
      this.selectBox.style.height = '0px';
      this.selectBox.style.width = '0px';
    }
  }

  handleClick(e) {
    e.stopPropagation();
    let elem = e.target;
    //double click
    if (!!this.prevClickTime && (e.timeStamp - this.prevClickTime) < 300) {
      elem.contentEditable="true";
      this.beforeValue = Object.assign({}, {
        type: 'edit',
        elem: elem,
        desc: elem.innerText
      });
      this.prevElem = null;
      elem.style.backgroundColor = '';
      elem.style.transition = '';
      elem.focus();
      //window.getSelection().collapseToStart();
    //merge
    } else if (this.prevElem && this.prevElem != elem) {

      if (this.prevElem.offsetLeft < elem.offsetLeft) {
        mergeElement({target: this.prevElem, source: elem, history: this.editHistory});
      } else {
        mergeElement({target: elem, source: this.prevElem, history: this.editHistory});
      }
      this.prevElem.style.backgroundColor = '';
      this.prevElem.style.transition = '';
      this.prevElem = null;

    } else if (elem.contentEditable !== 'true') {
      this.prevElem = elem;
      elem.style.transition = 'all 00.25s ease';
      elem.style.backgroundColor = '#4cacd8';
    } else {

    }
    this.prevClickTime = (e.timeStamp);
  }

  handleBlur(e) {
    e.target.contentEditable="false";
    if (this.beforeValue.desc != e.target.innerText) {
      this.editHistory.history = this.beforeValue;
    }
    e.target.style.backgroundColor = '';
    e.target.style.transition = '';
    this.beforeValue = null;
  }

  keyHandler(e) {
    if ((e.metaKey || e.ctrlKey) && e.which == 90) {
      let prev = this.editHistory.history;
      if (prev) {
        if (prev.type == 'edit') {
          prev.elem.innerText = prev.desc;
        } else if (prev.type == 'merge') {
          prev.elem.innerText = prev.desc;
          prev.elem.style.minWidth = `${prev.minWidth}px`;
          prev.restore.setAttribute('data-show', true);
          prev.restore.style.display = '';
        } else if (prev.type == 'delete') {
          prev.elem.setAttribute('data-show', true);
          prev.elem.style.display = '';
        }
      }
    } else if (e.which == 46) {
      console.log('delete');
      if (this.prevElem) {
        this.editHistory.history = Object.assign({}, {
          type: 'delete',
          elem: this.prevElem
        });
        this.prevElem.setAttribute('data-show', false);
        this.prevElem.style.display = 'none';
        this.prevElem.style.backgroundColor = '';
        this.prevElem.style.transition = '';
        this.prevElem = null;
      }
    }
  }

  save() {
    let items = this.wrapBox.querySelectorAll(`div[data-show='true']`),
      saveData = {
        textAnnotations: []
      };
    for (let item of items) {
      saveData.textAnnotations.push(Object2Json(item, this.props.zoom.value));
    }
    //console.log(JSON.stringify(saveData));

    this.props.dispatch(saveJsonData({filename: this.props.filename, data: saveData}));
  }

  componentDidUpdate() {
    //ctrlKey metaKey
    console.log('Desc componentDidUpdate' + this.props.boxies.length);
    document.body.removeEventListener('keydown', this.keyHandler, false);
    document.body.addEventListener('keydown', this.keyHandler, false);
    if (this.wrapBox) {
      this.wrapOffset = cumulativeOffset(this.wrapBox);
    }
  }

  componentWillUnmount() {
    console.log('Desc componentWillUnmount');
  }

  componentWillReceiveProps(nextProps) {
    console.log('Desc componentWillReceiveProps', this.props, nextProps);
    if (this.props.save != nextProps.save && nextProps.save) {
      this.save();
    }
    if (this.props.zoom.value != nextProps.zoom.value) {
      this.changeZoom = true;
    } else {
      this.changeZoom = false;
    }
  }

  //shouldComponentUpdate(nextProps) {
    //console.log('shouldComponentUpdate', nextProps.routing.search != this.props.routing.search);
    //return nextProps.routing.search != this.props.routing.search;
  //}

  componentWillUpdate() {
    console.log('Desc componentWillUpdate');
  }

  componentWillUnmount() {
    console.log('Desc componentWillUnmount');
  }

  componentDidMount() {
    console.log('Desc componentDidMount');
  }

  render() {
    let { boxies, opacity, width, height, zoom } = this.props;
    this.boxies = Object.assign([], boxies);
    console.log('render', zoom.value);
    if (boxies.length > 0) {
      return (
        <div ref={(wrapBox) => this.wrapBox = wrapBox} id="wrap-item" style={{position: 'absolute', top: '0px', left: '0px', width: `${(width*zoom.value)}px`, height: `${(height*zoom.value)}px`, zIndex: 3, opacity: (1-opacity.value)}}
          onClick={this.handleWrapClick}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}>
        {boxies.map((box, index) =>
          <div
            data-show="true"
            style={this.getStyle(box.boundingPoly.vertices, box.description)}
            key={`box-${index}`}
            onClick={this.handleClick}
            onBlur={this.handleBlur}
            onMouseMove={this.handleMouseMove}>
            {box.description}
          </div>
        )}
          <div ref={(selectBox) => this.selectBox = selectBox}
            style={ {top: '0px', left: '0px', width: '1px', height: '1px', display: 'none', position: 'absolute', zIndex: 1000, border: 'solid 2px #6486d8'} }>
            <div style={ {backgroundColor: 'grey', opacity: 0.2, position: 'relative', width: '100%', height: '100%'} }></div>
          </div>
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
}

function mapStateToProps(state) {
  const { opacity, zoom, save } = state;
  return {
    opacity,
    zoom,
    save
  };
}

export default connect(mapStateToProps)(Desc);