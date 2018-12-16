import React from 'react';
import { uniqueId } from '../../util/id_generator'
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';
import EventPredictionTile from './event_prediction';

class EventDetail extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      events: [],
      eventKeys: [],
      eventScores: {},
      eventLib: {},
      eventName: "",
      search:''
      
    }
  }

  

  componentDidMount(){
    // console.log(this.props)
    this.setState({
      events: this.props.allEvents,
      eventKeys: this.props.eventKeys,
      eventScores: this.props.eventScores,
      eventLib: this.props.eventLib,
      search: this.props.search,

    })
  }

  componentWillUpdate(nextProps, nextState){
    this.state.eventName = nextProps.eventName
    this.state.search = nextProps.search
    // this.state.allEvents = nextProps.allEvents
  }


  injectTags(currEvent, eventCount){
    return (
      <div className="">
        <div className="carousel-title ">Search Results...</div>
        <hr className="result"/>
        <div className="result result-key-container">
          <div className="result-key p-wrapper">
            <span className="dot dot-red"></span><p>Not a match</p>
            <span className="dot dot-yellow"></span><p>Poor</p>
            <span className="dot dot-blue"></span><p>Fair</p>
            <span className="dot dot-green"></span><p>Good match</p>
          </div>
          <div className="result-classified p-wrapper">
            <p>
              <b>{eventCount}</b> classified images
            </p>
          </div>
        </div>
        <hr className="result"/>
      </div>
    )
  }

  render() {
    
    let currEvent = this.state.eventName
    let allEvents = this.state.events

    let filteredEvents = allEvents.filter(
        (event) => {
          return event.videoStream == currEvent
        }
      )

      
    
    return (
      <div>
        {this.injectTags(currEvent, filteredEvents.length)}
        <div className="grid-wrapper">
          <EventPredictionTile search={this.state.search} events={filteredEvents} allEvents={allEvents}/> 
        </div>
      </div>
    )
  }
  
}

export default EventDetail;
