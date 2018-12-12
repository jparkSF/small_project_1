import React from "react";
import EventListContainer from './eventLists/event_list_container';
import NavBar from './nav';

const header = () => {
  return(
    <div>
        <NavBar />
        <EventListContainer/>
    </div>
  );
};

export default header;
