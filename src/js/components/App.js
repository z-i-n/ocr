import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Nav, NavItem, Glyphicon, Grid, Row, Col, Button } from 'react-bootstrap';
import { LoadingBar, showLoading, hideLoading } from 'react-redux-loading-bar';
import { Link } from 'react-router';
import { OCRLIST } from '../constants';

class App extends Component {

  setActive(props, path) {
    return props.location.pathname.includes(path) ? 'active' : '';
  }

  componentWillMount() {
    //console.log("componentWillMount");
  }
  componentDidMount() {
    //console.log("componentDidMount");
  }
  componentWillReceiveProps(nextProps) {
    //console.log("componentWillReceiveProps: ", nextProps);
  }
  componentWillUpdate(nextProps, nextState) {
    //console.log("componentWillUpdate: ", nextProps, nextState);
  }
  componentDidUpdate(prevProps, prevState) {
    //console.log("componentDidUpdate: ", prevProps, prevState);
  }
  componentWillUnmount() {
    //console.log("componentWillUnmount");
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
          <LoadingBar style={{ position: 'fixed', top: '0px', zIndex: 10000 }} updateTime={400} loading={loadingBar}/>
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
                          <Link to="/edit/"><i className="fa fa-th-large"></i> <span className="nav-label">List</span> <span className="fa arrow"></span></Link>
                          <ul className="nav nav-second-level">
                            {OCRLIST.map((ocr, index) =>
                              <li key={`ocr-${index}`} className="active">
                                <Link to={{pathname: '/edit', search: `?e=${index}`}}>
                                  {ocr.name}
                                </Link>
                              </li>
                            )}
                          </ul>
                      </li>

                      <li className="active">
                          <a href="#"><i className="fa fa-edit"></i> <span className="nav-label">Forms</span><span className="fa arrow"></span></a>
                          <ul className="nav nav-second-level">
                              <li className="active"><Link to={{pathname: '/upload'}}>File Upload</Link></li>
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
  const { jsonData, opacity, zoom, loadingBar } = state;
  return {
    jsonData,
    opacity,
    zoom,
    loadingBar
  };
}

export default connect(mapStateToProps)(App);
