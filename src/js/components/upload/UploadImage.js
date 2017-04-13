import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Glyphicon, Grid, Row, Col, Button } from "react-bootstrap";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import { setOpacity, setZoom, uploadFile, requestListData } from "../../actions";

class UploadImage extends Component {

  constructor(...args) {
    super(...args);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    //console.log("DESC constructor");
  }

  componentDidMount() {
    ////console.log("componentDidMount", this.img.naturalHeight, this.img.naturalWidth);
  }

  componentDidUpdate(prevProps) {
    const { uploadStatus, dispatch } = this.props;
    ////console.log('componentDidUpdate');
    if (!prevProps.uploadStatus.isLoading && uploadStatus.isLoading && uploadStatus.fileName) {
      //console.log(uploadStatus.fileName);
      dispatch(hideLoading());
      dispatch(requestListData());
      this.props.router.replace('/edit/'+uploadStatus.fileName.replace('.', '/'));
    }
  }

  handleChange(e) {
    let filename;
    if (window.FileReader) {
      filename = e.target.files[0].name;
    } else {
      filename = e.target.value.split("/").pop();
    }

    this.displayFileName.value = filename;
  }

  handleUpload(e) {
    //this.uploadForm.submit();
    let file = this.ocrImage.files[0];
    this.props.dispatch(showLoading());
    this.props.dispatch(uploadFile(file));
    // let reader = new FileReader();

    // reader.onload = function( e ) {
    //   //e.currentTarget.result
    //   this.props.dispatch(uploadFile(e.currentTarget.result));
    // }.bind(this);

    // reader.readAsBinaryString( file );
  }

  render() {
    const { jsonData, opacity, location, zoom } = this.props;
    let boxies = [];
    if (jsonData.data && jsonData.data.length > 0) {
      boxies = jsonData.data;
    }
    return (
      <div className="col-lg-12">
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
              <div className="row show-grid">
                <div className="col-xs-8">
                  <div className="filebox">
                    <form ref={uploadForm => this.uploadForm = uploadForm}
                      id="uploadForm"
                      action="/fileupload"
                      method="post"
                      encType="multipart/form-data">
                      <input type="text" ref={input => this.displayFileName = input}
                        className="upload-name" value="Select File" disabled="disabled"/>
                      <label htmlFor="ocr_image">File</label>
                      <input type="file" ref={input => this.ocrImage = input}
                        id="ocr_image" name="ocr_image" className="upload-hidden" onChange={this.handleChange}/>
                    </form>
                  </div>
                </div>
                <div className="col-xs-4">
                  <Button bsClass="btn btn-info image-upload-btn" onClick={this.handleUpload}>Upload</Button>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { jsonData, opacity, zoom, uploadStatus } = state;
  return {
    jsonData,
    opacity,
    zoom,
    uploadStatus
  };
}

export default connect(mapStateToProps)(UploadImage);
