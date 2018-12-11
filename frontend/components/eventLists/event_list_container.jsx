import React from 'react';
import {connect} from 'react-redux';
import EventList from './event_list';
import {fetchData} from '../../actions/event_action';



const mapStateToProps = state => {
  let chopped = state.events.mockResponse
  return {events: chopped}
};

const mapDispatchToProps = dispatch => ({
  fetchData: () => dispatch(fetchData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventList);
