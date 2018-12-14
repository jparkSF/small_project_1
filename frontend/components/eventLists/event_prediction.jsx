import React from 'react';
import { uniqueId } from '../../util/id_generator'
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';
import PredictionTile from './prediction_tile'

class EventPredictionTile extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount(){
    // console.log('1')
  }

  destructEvents(filteredEvents) {
    let sortedEvents = this.sortByTimestamp(filteredEvents)
    console.log(filteredEvents)
    return (
      sortedEvents.map((event, idx) => {
        return (
          <PredictionTile event={event} key={idx} />
        )
      })
    )
  }


  sortByTimestamp(filteredEvents) {
    let sortedEvents = filteredEvents.sort((a, b) => {
      return a.timestamp - b.timestamp
    })

    return sortedEvents
  }


  render() {
    // console.log('2')
    let events = this.props.events
    return(
      <ul className="grid-container">
        {this.destructEvents(events)}
      </ul>
    )
  }

}

export default EventPredictionTile;
