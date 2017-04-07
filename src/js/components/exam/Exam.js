import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { requestJsonData } from '../../actions/ocrData';
import Desc from './Desc';
import { OCRLIST } from '../../constants';
import { setOpacity, setZoom } from '../../actions';

class Exam extends Component {

  constructor(...args) {
    super(...args);
    this.handleLoad = this.handleLoad.bind(this);
    this.state = {
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    //console.log('componentDidMount', this.img.naturalHeight, this.img.naturalWidth);
  }

  componentDidUpdate(prevProps) {
    const { jsonData, dispatch } = this.props;
    //console.log('componentDidUpdate');
    if (!prevProps.jsonData.isLoading && jsonData.isLoading && jsonData.data.length > 0) {
      dispatch(setOpacity());
      dispatch(setZoom());
      dispatch(hideLoading());
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

  render() {
    const { jsonData, opacity, location, zoom } = this.props;
    let boxies = [];
    if (jsonData.data && jsonData.data.length > 0) {
      boxies = jsonData.data;
    }
    return (
      <div>

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
  const { jsonData, opacity, zoom } = state;
  return {
    jsonData,
    opacity,
    zoom
  };
}

export default connect(mapStateToProps)(Exam);
