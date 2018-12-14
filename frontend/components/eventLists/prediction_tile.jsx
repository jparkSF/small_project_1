import React from 'react';
import { uniqueId } from '../../util/id_generator'
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';

class PredictionTile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      event: {},
      currDetectionId: 0,
      predictions: []
    }
  }
  componentWillMount(){
    this.setState({
      event: this.props.event,
      predictions: this.props.event.predictions
    })
  }

  componentWillReceiveProps(nextProps){
    
    let event = nextProps.event
    let currDetectionId = 0
    let predictions = nextProps.event.predictions

    this.setState({
      event,
      currDetectionId,
      predictions
    })
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
    let event = this.state.event
    
    if(!event){
      return (null)
    } else {
      let detectionLength = this.state.predictions.length
      let currDetectionId = this.state.currDetectionId
      let detection = this.state.predictions[currDetectionId]
      let date =  new Date(event.timestamp)
      let parsedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      return (
        <li className="grid-item prediction-tile">
          
          <img src={event.imageSource} alt=""/>
          <p id="timestamp">{parsedDate}</p>
          
          {
            detectionLength == 1 ? <div></div> : 
              <div>
                <p id="detection">Detection {currDetectionId + 1}/{detectionLength}</p>
                <button onClick={() => this.handleClick('left', detectionLength)}>left</button>
                <button onClick={() => this.handleClick('right', detectionLength)}>right</button>
              </div>
          }
          
          
          <div id="detection-scores">
            { 
              detection.scores.map((score,idx) => {
                return (
                  <div key={idx}> 
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
