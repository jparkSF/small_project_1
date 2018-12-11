import {combineReducers} from 'redux';
import events from './events_reducer';
import allEvents from './selectors';

const rootReducer = combineReducers({
  events
});

export default rootReducer;
