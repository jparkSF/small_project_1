import React from 'react';
import { uniqueId } from '../../util/id_generator'
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';

class EventDetail extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      events: [],
      eventKeys: [],
      eventScores: {},
      eventLib: {},
      eventName: ""
    }
  }

  componentDidMount(){
    // console.log(this.props)
    this.setState({
      events: this.props.allEvents,
      eventKeys: this.props.eventKeys,
      eventScores: this.props.eventScores,
      eventLib: this.props.eventLib
    })
  }

  componentWillUpdate(nextProps, nextState){
    this.state.eventName = nextProps.eventName
  }

  sortByTimestamp(filteredEvents){
    let sortedEvents = filteredEvents.sort((a,b) => {
      return a.timestamp - b.timestamp
    })

    return sortedEvents
  }

  destructEvents(filteredEvents){
    let sortedEvents = this.sortByTimestamp(filteredEvents)
    
    
    return (
        sortedEvents.map(event => {
        let date = new Date(event.timestamp)
        let parsedDate = `${date.getFullYear()} / ${date.getMonth() + 1} / ${date.getDate()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        
        return(
          <li className="grid-item">
            <img src={event.imageSource} alt=""/>
            <p>{event.videoStream}</p>
            <p>{parsedDate}</p>
            <p>
              {
                event.predictions.map(el => {
                  let scores = el.scores
                  return (
                    scores.map(score => {
                      return (
                        <span>{score.label}, {score.score}%<br /></span>
                      )
                    })
                  )
                })
              }
            </p>
          </li>
        )
      })
    )
  }

  injectTags(currEvent, eventCount){
    if(currEvent){
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
          <ul className="grid-container">
            {this.destructEvents(filteredEvents)}
          </ul>  
        </div>
      </div>
    )
  }
  
}

export default EventDetail;
