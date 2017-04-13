//@flow
import fetch from 'isomorphic-fetch';

const url = "/api/list";
export const REQUEST_LIST_DATA = 'REQUEST_LIST_DATA';
function requestData() {
  return {
    type: REQUEST_LIST_DATA
  };
}

export const RECEIVE_LIST_DATA = 'RECEIVE_LIST_DATA';
function receiveData(json) {
  return {
    type: RECEIVE_LIST_DATA,
    list: json
  };
}

export function requestListData() {
  return (dispatch, getState) => {
    dispatch(requestData());

    return fetch(url)
      .then(response => { return response.json(); })
      .then(json => { return dispatch(receiveData(json)); });
  };
}
