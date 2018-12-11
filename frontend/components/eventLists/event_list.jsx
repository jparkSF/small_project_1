import React from 'react';
import { uniqueId } from '../../util/id_generator'

class EventList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: this.props.event

    }

  }

  componentDidMount() {
    let events = this.props.fetchData()
    let chopped = events.data.data.mockResponse


    let eventKeyLib = this.indexKeywords(chopped)



    this.setState({
      events: chopped,
      eventKeyLib
    })
  }

  indexKeywords(chopped) {
    let lib = {}
    chopped.events.forEach(el => {
      lib[el.videoStream] = el.imageSource
    })

    return lib

  }

  destructEventData(event, imgUrl) {

    return (
      <li key={`${imgUrl}+${uniqueId()}`}>
        <p>{event}</p>
        <p><img src={imgUrl} alt="" /></p>
      </li>
    )
  }

  handleInput(e) {
    e.preventDefault();
    let value = e.target.value
    console.log(value)

  }



  render() {
    let data = this.state.events
    console.log(this.state)
    if (!data) {
      return (
        <div>hello</div>
      )
    } else {
      let size = data.events.length
      let eventLib = this.state.eventKeyLib
      let eventKeys = Object.keys(eventLib)

      return (
        <div>
          {/* EVENT INDEX */}
          <ul>
            {eventKeys.map(event => this.destructEventData(event, eventLib[event]))}
          </ul>

          {/*SEARCH BAR */}
          <input type="text" onChange={e => this.handleInput(e)} />
        </div>
      );
    }
  }
}

export default EventList;
