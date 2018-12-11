import React from 'react';
import * as APIUtil from '../util/api_util'


export const RECEIVE_DATA = 'RECEIVE_DATA';
export const LOAD_DATA = 'LOAD_DATA';

export const receiveData = (data) => ({
  type: RECEIVE_DATA,
  data
});

export const loadData = () => ({
  type: LOAD_DATA,
});

export const fetchData = () => dispatch => {
  // dispatch(loadData());
  let data = APIUtil.fetchData()
  
  
  return dispatch(receiveData(data))
  
};



