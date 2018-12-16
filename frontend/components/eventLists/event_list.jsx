import React from 'react';
import { uniqueId } from '../../util/id_generator'
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';
import EventDetail from './event_detail'
import _ from 'lodash';

class EventList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: this.props.event,
      search: '',
      eventDetailKey: '',
      searchResult:[]
    }

  }

  componentDidMount() {
    let events = this.props.fetchData()
    let chopped = events.data.data.mockResponse
    let eventsProcessed = this.processKeywords(chopped)

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
      keys: eventKeys,
      scores: eventScores
    }

  }


 
  

 
  filterEventsBySearch() {
    let searchKeywords = this.state.search.split(" ")
    const eventKeys = Object.keys(this.state.eventKeys);
    const labels = Object.keys(this.state.eventScores)
    
    console.log(searchKeywords)
    let filteredLabel = [];
    // console.log(eventKeys)
    if (!isEmpty(labels)) {

      filteredLabel = labels.filter(
        (label) => {
          return label.toLowerCase()
            .indexOf(searchKeywords[0].toLowerCase()) !== -1
            // .indexOf(this.state.search.toLowerCase()) !== -1;
              
        }
      );
    }

    return filteredLabel
  }

  makeUniqueEvents(labels) {

    let eventScores = this.state.eventScores
    let filteredEvents = {}

    labels.forEach(label => {
      let currLabel = eventScores[label].videoStream
      if (!filteredEvents[currLabel]) {
        filteredEvents[currLabel] = true
      }
    })
    let filteredEventKeys = Object.keys(filteredEvents)
    
    return filteredEventKeys
  }

  getEventDetails(event) {
    
    this.setState({ eventDetailKey: event })
  }

  handleInput(e) {
    let value = e.currentTarget.value
    
    _.debounce((value) => this.update(value),400)()
    
  }

  update(value){
    return (
      console.log("inside")
    )
    

  }


  render() {
    let data = this.state.events

    if (!data) {
      return (
        <div>hello</div>
      )
    } else {
      let size = data.events.length
      let eventLib = this.state.eventKeys
      let eventScores = this.state.eventScores
      let eventKeys = Object.keys(eventLib)

      let filteredLabels = this.filterEventsBySearch()
      let filteredEvents = this.makeUniqueEvents(filteredLabels)
      
      return (
        <div>
          {/*SEARCH BAR */}
          <section className="section-wrapper">
            <div>
              <h4 id="controls-title" className='fit-content'>Detector Gallery</h4>
              <p id="controls-description" className='fit-content'>Browse, discover, and use high quality detectors created by the Matroid community.</p>
            </div>
            <input type="text" id="searchField" className="" onChange={this.handleInput.bind(this)} defaultValue={this.state.search} placeholder="Search for detectors by detector information" />
          </section>

          {/* EVENT INDEX */}
          <section className="section-wrapper">

            <div id="eventIndex" className="event-container">
              <div className="carousel-title">Featured Events</div>
              <ul id="events" className="horizontal-list ">
                {
                  filteredEvents.map((event, idx) => {
                    return (
                      <a id="event-name-tag" className="list-items grid-item no-margin"  onClick={() => this.getEventDetails(event)} key={idx}>
                        <div style={{ backgroundImage: `url(${eventLib[event]})`, backgroundSize: "100% 100%" }}>
                          <li className="" key={`${event}+${uniqueId()}`}>
                            <p>{event}</p>
                          </li>
                        </div>
                      </a>
                    )
                  })
                }
              </ul>

            </div>
            <div className="lower-content">
              
              <EventDetail
                search={this.state.search}
                allEvents={this.state.events.events}
                eventName={this.state.eventDetailKey}
                eventLib={eventLib}
                eventScores={eventScores}
                eventKeys={eventKeys}
              />
            </div>
          </section>
        </div>
      );
    }
  }
}

export default EventList;
