//@flow
import fetch from 'isomorphic-fetch';

const url = "/";
export const REQUEST_DATA = 'REQUEST_DATA';
function requestData() {
  return {
    type: REQUEST_DATA
  };
}

export const RECEIVE_DATA = 'RECEIVE_DATA';
function receiveData(json) {
  let arr = json.responses ? json.responses[0].textAnnotations : json.textAnnotations;
  if (json.responses) {
    arr.shift();
  }
  return {
    type: RECEIVE_DATA,
    data: arr
  };
}

export function requestListData(url) {
  return (dispatch, getState) => {
    dispatch(requestData());

    return fetch(url)
      .then(response => { return response.json(); })
      .then(json => { return dispatch(receiveData(json)); });
  };
}
