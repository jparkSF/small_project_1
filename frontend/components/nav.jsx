import React from 'react';
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="nav">
        <img src="assets/images/logo/blue-background-logo.png" alt=""/>
      </div>
    )
  }

}

export default NavBar;
