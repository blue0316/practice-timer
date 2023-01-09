import React from 'react';
import { connect } from 'react-redux';

import {
  viewTimerFullscreen,
  incrementTimer,
  nextSectionExcludingTravelTime,
  prevSectionExcludingTravelTime,
  navigationPop,
  endPractice,
} from '../../actions';

import Text from '../../components/StyledText';
import Container from '../../components/Container';
import Spacer from '../../components/Spacer';
import HeaderText from '../../components/HeaderText';
import CircularButton from '../../components/CircularButton';

import BackArrow from '../../assets/BackArrow.png';
import RightArrow from '../../assets/RightArrow.png';
import MenuButton from '../../assets/MenuButton.png';

import Timer from '../../containers/Timer';
import config from '../../config';

const styles = {
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  buttonLabelText: {
    textAlign: 'center',
    padding: 8
  },
  buttonWrapper: {
    alignItems: 'center'
  },
};

const MainFlowCurrentPracticePlayback = (props) => {
  console.log('MAINFLOW PLAYBACK:  ', props);

  return (
    <Container>
      <Spacer height={50} />
      <HeaderText>
        { this.props.currentPracticeSectionName }
      </HeaderText>
      <Timer style={{fontSize: 90}} />
      <div style={styles.buttonContainer}>
        <div style={styles.buttonWrapper}>
          <span style={styles.buttonLabelText}>{`Restart Practice`}</span>
          <CircularButton
            onPress={() => {this.props.repeatPreviousSection()}}
            large={true} >
            <img style={{
              height: 32,
              width: 32,
            }} src={BackArrow} />
          </CircularButton>
        </div>
        <div style={styles.buttonWrapper}>
          <span style={styles.buttonLabelText}>{` `}</span>
          <CircularButton
            onPress={() => {this.props.addTime()}}
            large={true} >
            <HeaderText>{`+0:30`}</HeaderText>
          </CircularButton>
        </div>
        <div style={styles.buttonWrapper}>
          <span style={styles.buttonLabelText}>{`Next`}</span>
          <CircularButton
            onPress={() => {this.props.advanceNextSection()}}
            large={true} >
            <img style={{
              height: 32,
              width: 32,
            }} src={RightArrow} />
          </CircularButton>
          <span style={styles.buttonLabelText}>{ this.props.nextSectionName ? this.props.nextSectionName : '(End Practice)' }</span>
        </div>
      </div>
      <span style={{marginLeft: 16, marginBottom: 8}}>{`Notes`}</span>
      <span style={{marginLeft: 16}}>{this.props.currentPracticeSectionNotes }</span>
    </Container>
  );
};

const mapStateToProps = (state) => {
  const sectionName = (state.timer.practiceSections && state.timer.currentIndex !== null && state.timer.currentIndex < state.timer.practiceSections.length) ?
    state.timer.practiceSections[state.timer.currentIndex].practiceSectionName : "";
  const nextSectionName = (state.timer.practiceSections && state.timer.currentIndex !== null && state.timer.currentIndex+1 < state.timer.practiceSections.length) ?
    state.timer.practiceSections[state.timer.currentIndex+1].practiceSectionName : null;
  const user = state.user.userID;
  const notes = (state.timer.practiceSections && state.timer.currentIndex !== null && state.timer.currentIndex < state.timer.practiceSections.length && state.timer.practiceSections[state.timer.currentIndex].practiceSectionNotes && state.timer.practiceSections[state.timer.currentIndex].practiceSectionNotes[user]) ?
    state.timer.practiceSections[state.timer.currentIndex].practiceSectionNotes[user] : "(No notes.)";
  return {
    isActive: state.timer.isActive,
    loading: state.timer.loading,
    practiceName: state.timer.practiceName,
    currentPracticeSectionName: sectionName,
    nextSectionName: nextSectionName,
    currentPracticeSectionNotes: notes,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    restartPractice: () => { dispatch(viewTimerFullscreen()) }, // TODO
    addTime: () => { dispatch(incrementTimer(30)) },
    advanceNextSection: () => { dispatch(nextSectionExcludingTravelTime()) },
    repeatPreviousSection: () => { dispatch(prevSectionExcludingTravelTime()) },
    stopPractice: () => { dispatch(endPractice()) },
  };
}

const MainFlowCurrentPracticePlaybackRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainFlowCurrentPracticePlayback);

export default MainFlowCurrentPracticePlaybackRedux;
