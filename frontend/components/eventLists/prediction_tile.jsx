import React from 'react';
import { uniqueId } from '../../util/id_generator'
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';

class PredictionTile extends React.Component {
  constructor(props) {
    super(props);
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
            {/* <img src={event.imageSource} alt="" /> */}
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


  render() {
    let event = this.props.event
    console.log(event)
    if(!event){
      return (null)
    } else {
      let date =  new Date(event.timestamp)
      let parsedDate = `${date.getFullYear()} / ${date.getMonth() + 1} / ${date.getDate()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      return (
        <li className="grid-item prediction-tile">
          <div id="tile-thumbnail" style={{ backgroundImage: `url(${event.imageSource})`}}>
            <p>{parsedDate}</p>
          </div>
          {/* <img src={event.imageSource} alt="" /> */}
          
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
    }
  }

}

export default PredictionTile;
