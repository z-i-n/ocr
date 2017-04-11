import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Glyphicon, Grid, Row, Col, Button } from 'react-bootstrap';
import { showLoading, hideLoading } from "react-redux-loading-bar";
import { setOpacity, setZoom } from "../../actions";

class UploadImage extends Component {

  componentDidMount() {
    //console.log("componentDidMount", this.img.naturalHeight, this.img.naturalWidth);
  }

  componentDidUpdate(prevProps) {
    //console.log("componentDidUpdate");
  }

  render() {
    const { jsonData, opacity, location, zoom } = this.props;
    let boxies = [];
    if (jsonData.data && jsonData.data.length > 0) {
      boxies = jsonData.data;
    }
    return (
      <div className="col-lg-6">
        <div className="ibox float-e-margins">
            <div className="ibox-title">
                <h5>File Upload</h5>
                <div className="ibox-tools">
                    <a className="collapse-link">
                        <i className="fa fa-chevron-up"></i>
                    </a>
                </div>
            </div>
            <div className="ibox-content">
              <form ref="uploadForm"
                id="uploadForm"
                action="http://localhost:8000/upload"
                method="post"
                encType="multipart/form-data">
                  <input type="file" name="sampleFile" className="btn image-upload-form"/>
                  <Button bsClass="btn btn-info image-upload-btn">Upload</Button>
              </form>
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

export default connect(mapStateToProps)(UploadImage);
