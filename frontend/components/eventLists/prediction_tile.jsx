import React from 'react';
import { uniqueId } from '../../util/id_generator'
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';

class PredictionTile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currDetectionId: 0
    }
  }


  destructEvents(filteredEvents) {
    let sortedEvents = this.sortByTimestamp(filteredEvents)

    return (
      sortedEvents.map(event => {
        let date = new Date(event.timestamp)
        let parsedDate = `${date.getFullYear()} / ${date.getMonth() + 1} / ${date.getDate()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        return (
          <li className="grid-item">
          
            <div id="tile-thumbnail" style={{backgroundImage: `url(${event.imageSource})`}}></div>
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


  sortByTimestamp(filteredEvents) {
    let sortedEvents = filteredEvents.sort((a, b) => {
      return a.timestamp - b.timestamp
    })

    return sortedEvents
  }

  handleClick(str, detectionLength){
    let currDetectionId = this.state.currDetectionId;
   
    switch(str){
      case 'left':
        if(currDetectionId === 0){
          currDetectionId = detectionLength - 1
          this.setState({ currDetectionId })
        } else {
          currDetectionId--
          this.setState({ currDetectionId })
        }
        break;

      case 'right':
        if (currDetectionId + 1 === detectionLength) {
          currDetectionId = 0
          this.setState({ currDetectionId })
        } else {
          currDetectionId++
          this.setState({ currDetectionId })
        }
        break;
    }

  }


  render() {
    let event = this.props.event
    let detectionLength = event.predictions.length
    let currDetectionId = this.state.currDetectionId
    let detection = event.predictions[currDetectionId]

    if(!event){
      return (null)
    } else {
      let date =  new Date(event.timestamp)
      let parsedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      return (
        <li className="grid-item prediction-tile">
          
          <img src={event.imageSource} alt=""/>
          <p id="timestamp">{parsedDate}</p>
          
          {
            detectionLength == 1 ? null : 
              <div>
                <p id="detection">Detection {currDetectionId + 1}/{detectionLength}</p>
                <button onClick={() => this.handleClick('left', detectionLength)}>left</button>
                <button onClick={() => this.handleClick('right', detectionLength)}>right</button>
              </div>
          }
          
          
          <div id="detection-scores">
            { 
              detection.scores.map(score => {
                return (
                  <div> 
                    <p>
                      <span>{score.label}</span>
                      <span>{(score.score).toFixed(2)} %</span>
                    </p>
                    <p>
                      graph
                    </p>
                    
                  </div>
                )
              })
            }
          </div>
        </li>
      )
    }
  }

}

export default PredictionTile;
