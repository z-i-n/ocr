//@flow
import fetch from 'isomorphic-fetch';
import io from 'socket.io-client';

const url = '/api/item/';

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

export const REQUEST_SAVE = 'REQUEST_SAVE';
function requestSave() {
  return {
    type: REQUEST_SAVE
  };
}

export const RECEIVE_SAVE = 'RECEIVE_SAVE';
function receiveSave() {
  return {
    type: RECEIVE_SAVE
  };
}

export function requestJsonData(id) {
  return (dispatch, getState) => {
    dispatch(requestData());

    return fetch(url+id)
      .then(response => { return response.json(); })
      .then(json => { return dispatch(receiveData(json)); });
  };
}

let socket;
export function saveJsonData(json) {

  if (!socket) {
    socket = io.connect();

    /*var el = document.getElementById('server-time');
    socket.on('create_room', function(timeString) {
      el.innerHTML = 'Server time: ' + timeString;
    });*/
    socket.on('saved', function(data) {
      //done save
      //console.log(data);
    });
  }

  //console.log(json);
  return (dispatch, getState) => {
    dispatch(requestSave());

    return socket.emit('save', json, function(data) {
      //console.log(data);
      return dispatch(receiveSave());
    });
  };
}
