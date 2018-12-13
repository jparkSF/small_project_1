import React from 'react';
import { uniqueId } from '../../util/id_generator'
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';
import PredictionTile from './prediction_tile'

class EventPredictionTile extends React.Component {
  constructor(props) {
    super(props);
  }

  destructEvents(filteredEvents) {
    let sortedEvents = this.sortByTimestamp(filteredEvents)
    
    return (
      sortedEvents.map(event => {
        return (
          <PredictionTile event={event} />
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
    let events = this.props.events
    return(
      <ul className="grid-container">
        {this.destructEvents(events)}
      </ul>
    )
  }

}

export default EventPredictionTile;
