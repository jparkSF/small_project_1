import React from 'react';
import { uniqueId } from '../../util/id_generator'
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';

class EventList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: this.props.event,
      search: ''

    }

  }

  componentDidMount() {
    let events = this.props.fetchData()
    let chopped = events.data.data.mockResponse


    let eventsProcessed  = this.processKeywords(chopped)
    
    this.setState({
      events: chopped,
      eventKeys: eventsProcessed.keys,
      eventScores: eventsProcessed.scores
    })
  }

  processKeywords(data) {
    let eventKeys = {}
    let eventScores = {}
    data.events.forEach(event => {

      
      let currEvent = event.videoStream
      let predictions = event.predictions

      eventKeys[currEvent] = event.imageSource
      
      predictions.forEach(prediction => {
        let objects = prediction.scores

        objects.forEach(obj => {
          let label = obj.label;
          let score = obj.score
          if (!eventScores[label]) {
            eventScores[label] = {
              label,
              score,
              videoStream: currEvent
            }
          } else {
            let currentScore = score
            let maxScore = eventScores[label].score
            if (currentScore > maxScore) {
              maxScore = currentScore
            }
          }
        })
      })
    })

    return {
      keys : eventKeys,
      scores : eventScores
    }

  }

  update(e) {
    e.preventDefault();

    const search = 'search'
    return (
      this.setState({
        [search]: e.currentTarget.value
      })
    )
  }

  filterEventsBySearch(){
    let searcKeywords = this.state.search.split(" ")
    const eventKeys = Object.keys(this.state.eventKeys);
    const labels = Object.keys(this.state.eventScores)
    let filteredLabel = [];
    // console.log(eventKeys)
    if (!isEmpty(labels)) {

      filteredLabel = labels.filter(
        (label) => {
          return label.toLowerCase()
            .indexOf(this.state.search.toLowerCase()) !== -1;
        }
      );
    }
    
    return filteredLabel
  }

  makeUniqueEvents(labels){
    
    let eventScores = this.state.eventScores
    let filteredEvents = {}

    labels.forEach(label => {
      let currLabel = eventScores[label].videoStream
      if (!filteredEvents[currLabel]){
        filteredEvents[currLabel] = true
      }
    })
    let filteredEventKeys = Object.keys(filteredEvents)
    console.log(filteredEventKeys)
    console.log(this.state)
    return filteredEventKeys
  }

  getEventDetails(event){
    console.log(event)

  }



  render() {
    let data = this.state.events
    
    
    if (!data) {
      return (
        <div>hello</div>
      )
    } else {
      // console.log(this.state)
      let size = data.events.length
      let eventLib = this.state.eventKeys
      let eventScores = this.state.eventScores
      let eventKeys = Object.keys(eventLib)
      
      let filteredLabels = this.filterEventsBySearch()
      let filteredEvents = this.makeUniqueEvents(filteredLabels)
      
      return (
        <div>
          {/*SEARCH BAR */}
          <input type="text" onChange={this.update.bind(this)} defaultValue={this.state.search} placeholder="Search an event" />

          {/* EVENT INDEX */}
          <div id="eventIndex">
            <ul id="events" className="horizontal-list">
              {
                filteredEvents.map(event => {
                  return(
                    <li className="list-items" key={`${event}+${uniqueId()}`}>
                      <p>{event}</p>
                      <a onClick={() => this.getEventDetails(event)}><img src={eventLib[event]} alt="" /></a>
                    </li>
                  )
                })
              }
            </ul>

            <ul id="event-details">

            </ul>
          </div>
        </div>
      );
    }
  }
}

export default EventList;
