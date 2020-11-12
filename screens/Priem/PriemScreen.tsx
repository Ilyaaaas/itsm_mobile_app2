import React from "react";

import PriemFormList from './PriemFormList';
import PriemForm from './PriemForm';

class PriemScreen extends React.Component {
  render() {
      return <PriemFormList navigation={this.props.navigation}/>
  }
};

export default PriemScreen;
