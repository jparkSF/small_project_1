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
      predictions: [],
      index: props.tileIndex
    }
  }
  componentWillMount() {
    this.setState({
      event: this.props.event,
      predictions: this.props.event.predictions
    })
  }

  componentWillReceiveProps(nextProps) {
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


  handleClick(str, detectionLength) {
    let currDetectionId = this.state.currDetectionId;

    switch (str) {
      case 'left':
        if (currDetectionId === 0) {
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

    this.resetThumbs()
  }

  resetThumbs() {
    console.log(this.state.index)
    let thumbs = $('.thumbs')
    let up = thumbs[this.state.index * 2]
    let down = thumbs[(this.state.index * 2) + 1]

    let $up = $(up)
    let $down = $(down)

    if ($up.hasClass('fas')) {
      $up.addClass('far').removeClass('fas')
    }

    if ($down.hasClass('fas')) {
      $down.addClass('far').removeClass('fas')
    }
  }

  onMouse(event) {
    let eventType = event.type;
    let bounds = this.state.predictions[this.state.currDetectionId].boundingBox;
    let tiles = $('.image-overlay-box')
    let currentNode = tiles[this.state.index];
    let $currentNode = $(currentNode)
    let imageHeight = $currentNode.height()
    let imageWidth = $currentNode.width()

    let svgShadow = `
            <svg class="image-overlay-box-shadow"> 
              <path fill="black" opacity="0.7" fill-rule="evenodd"
                d="M0,0 h${imageWidth} v${imageHeight} h-${imageWidth} v-${imageHeight} z 
                M${imageWidth * bounds.left},${imageHeight * (bounds.top)}
                h${imageWidth * bounds.width}
                v${imageHeight * bounds.height}
                h-${imageWidth * bounds.width}
                v-${imageHeight * bounds.height}
                z
              "/>
            </svg>
             `

    switch (eventType) {
      case 'mouseover':
        $currentNode.prepend(svgShadow)
        break;

      case 'mouseout':
        $currentNode.find(':first-child').remove();
        break;
    }

  }

  changeStatus(str) {
    let key = str === "up" ? "up" : "down"

    let targetNode = $(`i#${key}`)[this.state.index]
    let $targetNode = $(targetNode)

    switch (key) {
      case 'up':
        if ($targetNode.hasClass("far")) {
          $targetNode.addClass("fas").removeClass("far")

          // check if down button is already clicked
          let downButton = $('i#down')[this.state.index]
          let $downButton = $(downButton)

          if ($downButton.hasClass("fas")) {
            $downButton.addClass("far").removeClass("fas")
          }
        } else {
          $targetNode.addClass("far").removeClass("fas")
        }

        break;

      case 'down':
        if ($targetNode.hasClass("far")) {
          $targetNode.addClass("fas").removeClass("far")
          // check if up button is already clicked
          let upButton = $('i#up')[this.state.index]
          let $upButton = $(upButton)

          if ($upButton.hasClass("fas")) {
            $upButton.addClass("far").removeClass("fas")
          }
        } else {
          $targetNode.addClass("far").removeClass("fas")
        }
        break;
    }
  }

  render() {
    let event = this.state.event

    if (!event) {
      return (null)
    } else {
      let detectionLength = this.state.predictions.length
      let currDetectionId = this.state.currDetectionId
      let detection = this.state.predictions[currDetectionId]
      let sortedByScore = detection.scores.sort((a, b) => (b.score - a.score))
      let date = new Date(event.timestamp)
      let parsedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      let bound = detection.boundingBox
      
      let boundingArea = {
        top: `calc((100% * ${(bound.top)}) + 2px)`,
        left: `calc((100% * ${(bound.left)}) + 2px)`,
        width: `calc(100% * ${bound.width}`,
        height: `calc(100% * ${bound.height})`
      }
      
      
    

      return (
        <li className="grid-item prediction-tile">
          <div className='image-overlay-box'>
            <img id="eventImage" src={event.imageSource} alt="" />
            <div className='image-overlay-bounding-box' onMouseOver={(e) => this.onMouse(e)} onMouseOut={(e) => this.onMouse(e)} style={boundingArea}>
            </div>
          </div>
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
              sortedByScore.map((score, idx) => {
                let confidence = score.score;
                let scoreColor = ''
                if (confidence <= 25) {
                  scoreColor = 'bg-danger'
                } else if (confidence <= 50) {
                  scoreColor = 'bg-warning'
                } else if (confidence <= 75) {
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
                      <div className={`progress-bar ${scoreColor}`} role="progressbar" style={{ width: `${score.score}%` }} aria-valuenow={score.score} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className="result-inspection">
            <p>is this <b>{sortedByScore[0].label}</b>?</p>
            <p>
              {/* up and down feedback won't be stored in DB, thus it resets every refresh of the page */}
              <i id="up" className="far fa-thumbs-up text-success thumbs" onClick={() => this.changeStatus('up')}></i>
              <i id="down" className="far fa-thumbs-down text-danger thumbs" onClick={() => this.changeStatus('down')}></i>
            </p>
          </div>
        </li>
      )
    }
  }
}

export default PredictionTile;
