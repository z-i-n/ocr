import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Glyphicon, Grid, Row, Col, Button } from 'react-bootstrap';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { requestJsonData } from '../../actions/ocrData';
import Desc from './Desc';
import { OCRLIST } from '../../constants';
import { setOpacity, setZoom, doSave } from '../../actions';
import { bindDomEvent } from '../../library/DomEventHandler';
import noUiSlider from 'nouislider';

class Edit extends Component {

  constructor(...args) {
    super(...args);
    this.handleLoad = this.handleLoad.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.state = {
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    console.log('Edit componentDidMount', this.img.naturalHeight, this.img.naturalWidth);
    bindDomEvent();

    let dispatch = this.props.dispatch,
      opacityValue = this.opacityValue,
      zoomValue = this.zoomValue;
    noUiSlider.create(this.opacitySlider, {
      start: this.props.opacity.value,
      behaviour: 'tap',
      connect: true,
      step: 0.1,
      range: {
        min: 0,
        max: 1
      }
    });
    noUiSlider.create(this.zoomSlider, {
      start: this.props.zoom.value,
      behaviour: 'tap',
      connect: true,
      step: 0.25,
      range: {
        min: 0.25,
        max: 3
      }
    });

    this.opacitySlider.noUiSlider.on('update', function( values, handle ) {
      opacityValue.innerHTML = values[handle];
    });

    this.zoomSlider.noUiSlider.on('update', function( values, handle ) {
      zoomValue.innerHTML = values[handle];
    });

    this.opacitySlider.noUiSlider.on('change', function(e) {
      dispatch(setOpacity(e[0]));
    });

    this.zoomSlider.noUiSlider.on('change', function(e) {
      dispatch(setZoom(e[0]));
    });
  }

  componentDidUpdate(prevProps) {
    const { jsonData, dispatch } = this.props;
    //console.log('componentDidUpdate');
    if (!prevProps.jsonData.isLoading && jsonData.isLoading && jsonData.data.length > 0) {
      this.opacitySlider.noUiSlider.set(0.3);
      this.zoomSlider.noUiSlider.set(1);
      dispatch(setOpacity());
      dispatch(setZoom());
      dispatch(hideLoading());
    }
    if (prevProps.save && !this.props.save) {
      this.props.dispatch(hideLoading());
    }
  }

  handleLoad(e) {
    const { dispatch } = this.props;
    dispatch(showLoading());
    this.setState({width: e.target.naturalWidth, height: e.target.naturalHeight});
    dispatch(requestJsonData(OCRLIST[this.props.location.query.e].json));
  }

  getStyle(isImage) {
    let width = `${(this.state.width * this.props.zoom.value)}px`;
    let height = `${(this.state.height * this.props.zoom.value)}px`;
    let style = {
      top: '0px',
      left: '0px',
      padding: 0,
      width: width,
      height: height
    };
    return !isImage
      ? Object.assign(style, {position: 'relative', zIndex: 1})
      : Object.assign(style, {position: 'absolute', zIndex: 2, opacity: this.props.opacity.value});
  }

  handleSave() {
    this.props.dispatch(showLoading());
    this.props.dispatch(doSave());
  }

  render() {
    const { jsonData, opacity, location, zoom } = this.props;
    let boxies = [];
    if (jsonData.data && jsonData.data.length > 0) {
      boxies = jsonData.data;
    }
    return (
      <div>

        <div className="col-lg-12">
            <div className="ibox float-e-margins">
                <div className="ibox-title">
                    <h5>Control Panel</h5>
                    <div className="ibox-tools">
                        <a className="collapse-link">
                            <i className="fa fa-chevron-down"></i>
                        </a>
                    </div>
                </div>
                <div className="ibox-content" style={{display: 'none'}}>
                  <div className="row show-grid">
                    <div className="col-xs-6 col-sm-4">
                      <p>Opacity: <span ref={(val) => this.opacityValue=val}>0.30</span></p>
                      <div id="opacity_slider" ref={(slider) => this.opacitySlider=slider}></div>
                    </div>

                    <div className="col-xs-6 col-sm-4">
                      <p>Zoom: <span ref={(val) => this.zoomValue=val}>1.00</span></p>
                      <div id="zoom_slider" ref={(slider) => this.zoomSlider=slider}></div>
                    </div>

                    <div className="col-xs-6 col-sm-4">
                      <Button bsStyle="success" style={{marginTop: '8px', float: 'right'}} onClick={this.handleSave}>Save</Button>
                    </div>
                  </div>
                </div>
            </div>
        </div>


        <div className="col-lg-12" style={{overflow: 'auto'}}
          ref={(div) => this.scrollWrap = div}>
          <div className="ibox ibox-content text-center float-e-margins"
            ref={(imgBox) => this.imgBox = imgBox}
            style={this.getStyle()}>
            <img ref={(img) => this.img = img}
              onLoad={this.handleLoad}
              src={OCRLIST[location.query.e].image}
              style={this.getStyle(true)} />
            <Desc
              scrollBox={this.scrollWrap}
              filename={OCRLIST[location.query.e].json}
              boxies={boxies}
              width={this.state.width}
              height={this.state.height}
              routing={location} />
          </div>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  const { jsonData, opacity, zoom, save } = state;
  return {
    jsonData,
    opacity,
    zoom,
    save
  };
}

export default connect(mapStateToProps)(Edit);
