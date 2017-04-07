import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Nav, NavItem, Glyphicon, Grid, Row, Col, Button } from 'react-bootstrap';
import { LoadingBar, showLoading, hideLoading } from 'react-redux-loading-bar';
import { Link } from 'react-router';
import { setOpacity, setZoom, doSave } from '../actions';
import { OCRLIST } from '../constants';

class App extends Component {

  constructor(...args) {
    super(...args);
    this.handleSave = this.handleSave.bind(this);
  }

  setActive(props, path) {
    return props.location.pathname.includes(path) ? 'active' : '';
  }

  componentWillMount() {
    //console.log("componentWillMount");
  }
  componentDidMount() {
    //console.log("componentDidMount");
    this.setTitle(this.props.location.pathname);

    let dispatch = this.props.dispatch;
    this.opacitySlider = document.getElementById('opacity_slider');
    noUiSlider.create(this.opacitySlider, {
      start: this.props.opacity.value,
      behaviour: 'tap',
      tooltips: true,
      connect: true,
      step: 0.1,
      range: {
        min: 0,
        max: 1
      }
    });

    this.opacitySlider.noUiSlider.on('change', function(e) {
      dispatch(setOpacity(e[0]));
    });

    this.zoomSlider = document.getElementById('zoom_slider');
    noUiSlider.create(this.zoomSlider, {
      start: this.props.zoom.value,
      behaviour: 'tap',
      tooltips: true,
      connect: true,
      step: 0.25,
      range: {
        min: 0.25,
        max: 3
      }
    });

    this.zoomSlider.noUiSlider.on('change', function(e) {
      dispatch(setZoom(e[0]));
    });
  }
  componentWillReceiveProps(nextProps) {
    //console.log("componentWillReceiveProps: ", nextProps);
    let { location, dispatch } = this.props;
    if (location.search != nextProps.location.search) {
      // opacitySlider.noUiSlider.set(0.4);
      // zoomSlider.noUiSlider.set(1);
    }
  }
  componentWillUpdate(nextProps, nextState) {
    //console.log("componentWillUpdate: ", nextProps, nextState);
  }
  componentDidUpdate(prevProps, prevState) {
    //console.log("componentDidUpdate: ", prevProps, prevState);
    this.setTitle(this.props.location.pathname);
    const { jsonData, dispatch } = this.props;
    if (!prevProps.jsonData.isLoading && jsonData.isLoading && jsonData.data.length > 0) {
      this.opacitySlider.noUiSlider.set(0.3);
      this.zoomSlider.noUiSlider.set(1);
    }
    if (prevProps.save && !this.props.save) {
      this.props.dispatch(hideLoading());
    }
  }
  componentWillUnmount() {
    //console.log("componentWillUnmount");
  }

  handleSave() {
    this.props.dispatch(showLoading());
    this.props.dispatch(doSave());
  }

  setTitle(paths) {
    let arrPath = paths.replace(/^\/|\/$/g, '') != "" ? paths.replace(/^\/|\/$/g, '').split('/') : [];
    let title = 'Dashboard - ' + (arrPath[arrPath.length-1] || 'home').toUpperCase();
    document.title = title;
    $('meta[property="og:title"]').attr('content', title);
  }

  render() {
    let { opacity, zoom, loadingBar } = this.props;
    return (
      <div>
        <header>
          <LoadingBar style={{ position: 'fixed', top: '0px', zIndex: 10000 }} loading={loadingBar}/>
        </header>
        <div id="wrapper">
          <nav className="navbar-default navbar-static-side" role="navigation">
              <div className="sidebar-collapse">
                  <ul className="nav metismenu" id="side-menu">
                      <li className="nav-header">
                          <div className="dropdown profile-element">
                              <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                                <span className="clear">
                                  <span className="block m-t-xs">
                                    <strong className="font-bold">OCR Test</strong>
                                  </span>
                                </span>
                              </a>
                          </div>
                          <div className="logo-element">
                              IN+
                          </div>
                      </li>
                      <li className="active">
                          <Link to="/example/"><i className="fa fa-th-large"></i> <span className="nav-label">Example</span> <span className="fa arrow"></span></Link>
                          <ul className="nav nav-second-level">
                            {OCRLIST.map((ocr, index) =>
                              <li key={`ocr-${index}`} className="active">
                                <Link to={{pathname: '/example', search: `?e=${index}`}}>
                                  {ocr.name}
                                </Link>
                              </li>
                            )}
                          </ul>
                      </li>
                  </ul>
              </div>
          </nav>

          <div id="page-wrapper" className="gray-bg dashbard-1">
            <div className="row border-bottom">
            <nav className="navbar navbar-static-top" role="navigation" style={{ marginBottom: '0' }}>
                <div className="navbar-header">
                    <a className="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i className="fa fa-bars"></i></a>
                </div>
                <div className="nav navbar-form-custom">
                    <p className="font-bold">Opacity</p>
                    <div id="opacity_slider"></div>
                </div>

                <div className="nav navbar-form-custom">
                    <p className="font-bold">Zoom</p>
                    <div id="zoom_slider"></div>
                </div>
                <ul className="nav navbar-top-links navbar-right">
                  <li>
                    <Button bsStyle="success" onClick={this.handleSave}>Save</Button>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="wrapper wrapper-content">
              <div className="row">
                {this.props.children}
              </div>
            </div>
            <div className="footer">
              <div className="pull-right">
                <strong>.</strong>
              </div>
              <div>
                <strong>Copyright</strong> Ray © 2014-2017
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { jsonData, opacity, zoom, loadingBar, save } = state;
  return {
    jsonData,
    opacity,
    zoom,
    loadingBar,
    save
  };
}

export default connect(mapStateToProps)(App);
