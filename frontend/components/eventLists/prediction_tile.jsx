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
      let progressBarStyle = {
        

      }
      return (
        <li className="grid-item prediction-tile">
          <img src={event.imageSource} alt=""/>
          <p id="timestamp">{parsedDate}</p>
          {
            detectionLength == 1 ? <div></div> : 
              <div id="detection">
                <a onClick={() => this.handleClick('left', detectionLength)}><i className="fas fa-arrow-left"></i></a>
                <p id="">Detection {currDetectionId + 1}/{detectionLength}</p>
                <a onClick={() => this.handleClick('right', detectionLength)}><i className="fas fa-arrow-right"></i></a>
              </div>
          }
          <hr />
          <div id="detection-scores">
            { 
              detection.scores.map((score,idx) => {
                let confidence = score.score;
                let scoreColor = ''
                if(confidence <= 25){
                  scoreColor = 'bg-danger'
                } else if (confidence <= 50){
                  scoreColor = 'bg-warning'
                } else if (confidence <= 75){
                  scoreColor = 'bg-info'
                } else {
                  scoreColor = 'bg-success'
                }

                return (
                  <div id="score-details" key={idx}> 
                    <p>
                      <span>{score.label}</span>
                      <span>{(score.score).toFixed(2)} %</span>
                    </p>
                    <div className="progress">
                      <div className={`progress-bar ${scoreColor}`} role="progressbar" style={{width: `${score.score}%`}} aria-valuenow={score.score} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
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
