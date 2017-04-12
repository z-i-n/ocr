//@flow
import fetch from 'isomorphic-fetch';

const url = '/fileupload';

export const REQUEST_UPLOAD_FILE = 'REQUEST_UPLOAD_FILE';
function requestUpload() {
  return {
    type: REQUEST_UPLOAD_FILE
  };
}

export const RECEIVE_UPLOAD_FILE = 'RECEIVE_UPLOAD_FILE';
function receiveUpload(json) {
  return {
    type: RECEIVE_UPLOAD_FILE,
    fileName: json.fileName
  };
}

export function uploadFile(fileData) {
  return (dispatch, getState) => {
    let form = new FormData();
    dispatch(requestUpload());

    form.append('ocr_image', fileData);
    return fetch( url, {
      method: 'post',
      body: form
    })
    .then(response => {
      return response.json();
    })
    .then(json => {
      return dispatch(receiveUpload(json));
    })
    .catch( function( error ) {
      console.log( 'Request failed', error );
    });
  };
}