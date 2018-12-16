import React from 'react';
import { uniqueId } from '../../util/id_generator'
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';
import PredictionTile from './prediction_tile'

class EventPredictionTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    }
  }

  componentWillMount() {
    this.setState({
      search: this.props.search
    })
  }
  componentWillUpdate(nextProps, nextState){
    
    this.state.search = nextProps.search
  }

  destructEvents(filteredEvents) {
    if(!isEmpty(filteredEvents)){
      let sortedEvents = this.sortByTimestamp(filteredEvents)

      return (
        sortedEvents.map((event, idx) => {
          return (
            <PredictionTile event={event} key={idx} tileIndex={idx} />
          )
        })
      )
    } else if (this.state.search.length != 0) {
      let allEvents = this.props.allEvents
      let splitSearch = this.state.search.split(" ")
      let search = splitSearch[0]
      let searchScore = splitSearch[1]
      let resultLibrary = []
      

      allEvents.map((event, index) => {
        event.predictions.map( prediction => {
          prediction.scores.map( score => {
            if (score.label.toLowerCase().indexOf(search) !== -1){
              if (resultLibrary.length == 0 || resultLibrary[resultLibrary.length - 1] !== allEvents[index]){
                if(searchScore){
                  if(searchScore <= score.score){
                    resultLibrary.push(allEvents[index])  
                  }
                } else {
                  resultLibrary.push(allEvents[index])
                }
              }
            }
          })
        })
      })

      let sortedLibrary = resultLibrary.sort( (a,b) => {
        b.timestamp - a.timestamp
      })
   
      return (
        sortedLibrary.map((event, idx) => {
          return (
            <PredictionTile event={event} key={idx} tileIndex={idx} />
          )
        })
      )
    }
    
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
