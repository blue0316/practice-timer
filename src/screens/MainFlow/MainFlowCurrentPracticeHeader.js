import React, { Component, useState } from 'react';
import { useAlert } from 'react-alert';
import Sound from 'react-sound';
require("moment-duration-format");

const styles = {};

function MainFlowCurrentPracticeHeader(props) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oneMinuteWarning, setOneMinuteWarning] = useState(null);
  const [endOfPeriod, setEndOfPeriod] = useState(null);
  const [endOfPractice, setEndOfPractice] = useState(null);
  const [viewingPlayback, setViewingPlayback] = useState(false);
  const [playbackState, setPlaybackState] = useState(props.teamData.practiceState);
  const [message, setMessage] = useState("");
  // const alert = useAlert();
  const [practicePlaybackController, setPracticePlaybackController] = useState(null);

  useEffect(() => {
    setOneMinuteWarning(new Sound(
      'one_minute_warning.mp3',
      Sound.MAIN_BUNDLE,
      error => {
        console.log('ONE MINUTE WARNIGN: ', error);
      }
    ));
    setEndOfPeriod(new Sound(
      'end_of_period_horn.mp3',
      Sound.MAIN_BUNDLE,
      () => {}
    ));
    setEndOfPractice(new Sound(
      'end_of_practice_horn.mp3',
      Sound.MAIN_BUNDLE,
      () => {}
    ));
    
    createPracticePlaybackController();

    return () => {
      if (practicePlaybackController) {
        practicePlaybackController.tearDown();
      }
    };
  }, []);

  const createPracticePlaybackController = () => {
    let modelTransformers = {
      team: (dataSnapshot) => {
        const unserailzedTeamUpdate = dataSnapshot.val()
        console.log('UNSERIALIZED TEMA UPDATE', unserailzedTeamUpdate)
        return unserailzedTeamUpdate
      },
      practice: (dataSnapshot)  => {
        return ModelTransformer.deserializePractice(dataSnapshot.val())
      },
      practiceSections: (dataSnapshot) => {
        let dict = {}
        dataSnapshot.forEach((child) => {
          dict[child.key] = ModelTransformer.deserializePracticeSection(child.val(), child.key);
        })
        return dict
      }
    }

    setPracticePlaybackController(new PracticePlaybackController(
      props.teamId,
      props.teamData.practiceState,
      props.firebase.database(),
      modelTransformers,
      practiceControllerDidUpdate
    ));
  }

  const practiceControllerDidUpdate = (messageType, messageData) => {
    if (messageType == 'updateState') {
      setMessage(messageData);
    }

    if (messageType == 'signal') {
      console.log('SIGNAL RECIEVED: ', messageData)
      switch(messageData.signalName) {
        case 'oneMinuteWarning':
          oneMinuteWarning.play((success) => {})
          Vibration.vibrate()
          break
        case 'endOfPeriod':
          endOfPeriod.play((success) => {})
          Vibration.vibrate()
          break
        case 'endOfPractice':
          endOfPractice.play((success) => {})
          Vibration.vibrate()
          this.setState({visible: false});
          break
        default:
          break
      }
    }
  }

  const formatTime = (timeValue) => {
    if (timeValue.asSeconds() < 60 && timeValue.asSeconds() >= 10) {
      return '0:' + timeValue.format('h:mm:ss')
    }
    if (timeValue.asSeconds() < 10) {
      return '0:0' + timeValue.format('h:mm:ss')
    }
    return  timeValue.format('h:mm:ss')
  }

  const renderHeader = () => {
    if (!visible || viewingPlayback) {
      return null;
    }
  
    const practiceTextColor =
      timeRemaining != null && timeRemaining.asSeconds() <= 60
        ? '#dd3f3e'
        : '#fff';
    if (loading) {
      return (
        <div style={{ backgroundColor: config.brandColor, justifyContent: 'center' }}>
          <p style={{ marginTop: 20, textAlign: 'center', marginBottom: 8, color: '#fff' }}>
            {'Loading...'}
          </p>
        </div>
      );
    }
  
    console.log('TIME REMAINGIN ', timeRemaining);
  
    const practiceTiming =
      !loading && timeRemaining != null
        ? ' | ' + this._formatTime(timeRemaining)
        : '';
  
    const practiceName = practice ? practice.name + practiceTiming : '';
    const practiceSection = currentPracticeSection
      ? 'Current Section: ' + currentPracticeSection.name
      : '';
  
    return (
      <div
        onClick={toggleViewingPractice}
        style={{ backgroundColor: config.brandColor, justifyContent: 'center' }}
      >
        <p style={{ marginTop: 20, textAlign: 'center', marginBottom: 8, color: practiceTextColor }}>
          {practiceName}
        </p>
        <p style={{ textAlign: 'center', marginBottom: 8 }}>{practiceSection}</p>
      </div>
    );
  }

  const startPractice = ({practiceData, practiceSections}) => {
    if (Object.keys(practiceSections).length === 0) {
      useAlert().error(
        'Whoops',
        'Add some practice periods to start this practice.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
      );
      console.log("No periods exist!");
      return;
    }
    let updates = {
        ['teams/' + props.teamId + '/practiceState']: {
        practiceId: practiceData._key,
        startTime: moment().unix(),
      },
    };
    setVisible(true);
    setLoading(true);
    practicePlaybackController.invalidateEverything();
    return props.firebase.database().ref().update(updates).catch( (err) => {
      useAlert().error(
        'Whoops',
        'Could not start practice.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
      )
    });
  }

  const toggleViewingPractice = () => {
    setViewingPlayback(!viewingPlayback);
  }

  const addTime = (timeToAdd = moment.duration({seconds: 30})) => {
    debugger;
    var updates = {}
    console.log('TRYING TO ADD TIME:', currentPracticeSection)
    if (currentPracticeSection) {
      let newDuration = moment.duration(currentPracticeSection.duration + timeToAdd)
      updates['practice-sections/' + playbackState.practiceId+ '/' + currentPracticeSection._key + '/practiceSectionDuration'] = newDuration.asSeconds()
      return props.firebase.database().ref().update(updates).catch( (err) => {
        useAlert().error(
          'Whoops',
          'Could not add time',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]
        )
      });
    }
  }

  const advanceNextSection = () => {
    var updates = {}
    let newDuration = moment.duration(currentPracticeSection.duration - timeRemaining)
    updates['practice-sections/' + playbackState.practiceId+ '/' + currentPracticeSection._key + '/practiceSectionDuration'] = newDuration.asSeconds()
    return props.firebase.database().ref().update(updates).catch( (err) => {
      useAlert().alert(
        'Whoops',
        'Could not advance to next section.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
      )
    });
  }

  const restartPractice = () => {    
    var updates = {}
    updates['teams/' + teamId + '/practiceState/startTime'] = moment().unix()
    return firebase.database().ref().update(updates).catch( (err) => {
      useAlert().error(
        'Whoops',
        'Could not advance to next section.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
      )
    });
  }

  const stopPractice = () => {
    var updates = {}
    updates['teams/' + teamId + '/practiceState'] = null
    return firebase.database().ref().update(updates).then( () => {

    }).catch( (err) => {
      useAlert().error(
        'Whoops',
        'Unable to stop practice.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
      )
    });
  }

  const renderPlayback = () => {
    return(
      <MainFlowCurrentPracticePlayback
        practice={practice}
        currentPracticeSection={currentPracticeSection || {}}
        nextSection={nextSection || {}}
        timeRemaining={timeRemaining || moment.duration({seconds: 0})}
        toggleViewingPractice={toggleViewingPractice}
        addTime={addTime}
        advanceNextSection={advanceNextSection}
        restartPractice={restartPractice}
        stopPractice={stopPractice}
        {...props}
      />
    )
  }

  return () => {
    // If we pass a parameter called secondary, use the secondary color
    const childrenWithProps = React.Children.map(props.children,
      (child) => React.cloneElement(child, {
       startPractice: startPractice
      })
    );

    const child = viewingPlayback == true && visible ? renderPlayback() : childrenWithProps

    return (
      <div style={{flex: 1}}>
        {renderHeader()}
        {child}
      </div>
    )
  }
}

export default MainFlowCurrentPracticeHeader