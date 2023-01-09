import React from 'react';
import { connect } from 'react-redux';
import config from '../config';

import Timer from './Timer';

const TimerBar = ({ isActive, loading, practiceName, currentPracticeSectionName, onTouchBar }) => {
  if (!isActive) {return null}

  if (loading) {
    return (
      <div style={{backgroundColor: config.brandColor, justifyContent: 'center'}}>
        <span style={{marginTop: 24, textAlign:'center', marginBottom: 8, color: '#fff'}}>{`Loading...`}</span>
      </div>
    )
  }

  const displayPracticeName = practiceName ? (practiceName) : 'Timer Inactive';
  const displayPracticeSectionName = currentPracticeSectionName ? 'Current Section: ' + currentPracticeSectionName : '';

  return (
    <button onPress={onTouchBar}>
      <div style={{backgroundColor: config.brandColor, justifyContent: 'center',}}>
        <Timer style={{marginTop: 20, textAlign:'center', marginBottom: 8,}} prepend={displayPracticeName}/>
        <span style={{textAlign:'center', marginBottom: 8}}>{displayPracticeSectionName}</span>
      </div>
    </button>
  );
};

const mapStateToProps = (state) => {
  const sectionName = (state.timer.practiceSections && state.timer.currentIndex !== null) ?
    state.timer.practiceSections[state.timer.currentIndex].practiceSectionName : "";
  return {
    isActive: state.timer.isActive,
    loading: state.timer.loading,
    practiceName: state.timer.practiceName,
    currentPracticeSectionName: sectionName,
  };
}

export default connect(
  mapStateToProps,
)(TimerBar);