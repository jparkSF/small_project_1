import merge from 'lodash/merge';
import {
  RECEIVE_DATA,
  LOAD_DATA
} from '../actions/event_action';


const initialState = {};

const eventsReducer = (state = initialState, action) => {
  let newState = {};
  
  Object.freeze(state);
  switch(action.type){
    case RECEIVE_DATA:  
    
      newState = merge({}, action.data.data);
      
      return newState;

    default:
      return state;
  }
};


export default eventsReducer;
