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





  render() {
    let currEvent = this.state.eventName
    let allEvents = this.state.events

    let filteredEvents = allEvents.filter(
      (event) => {
        return event.videoStream == currEvent
      }
    )

    console.log(filteredEvents)

    return (
      <div>
       
        <div className="grid-wrapper">
          <ul className="grid-container">
            {this.destructEvents(filteredEvents)}
          </ul>

          
          
        </div>
        {/* <div >
          <button className="btn" id="prevButton">Prev</button>
          <button className="btn" id="nextButton">Next</button>

        </div> */}
      </div>
    )
  }
  
}

export default EventDetail;
