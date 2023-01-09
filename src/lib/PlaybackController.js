import { Component } from 'react';



class PlaybackContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: props.team,
      practice: null,
      pracitceSections: null,
      practiceListener: null,
      practiceSectionsListener: null,
    }

    // Initialize tracking based on team state 
    if (team.practiceState != null) {
      // We have a currently selected practice 
    }
  }

  _teamPracticeStateDidUpdate(previousPracticeState, nextPracticeState) {
    // The previous practice is null
    if (previousPracticeState == {} || previousPracticeState == null) {


    }


  }


}