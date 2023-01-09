// import ModelListener from '../lib/ModelListener';
// import ModelTransformer from '../lib/ModelTransformer';
import firebase from '../services/firebase';
// import { NavigationActions } from 'react-navigation';
import { useNavigate } from 'react-router-dom';

import moment from 'moment';


const ModelTransformer = require('../lib/ModelTransformer');
const ModelListener = require('../lib/ModelListener');
/* NAV */

// export const navigateToTeam = () => NavigationActions.navigate({ routeName: 'Team' });
// export const navigateToLogin = () => NavigationActions.navigate({ routeName: 'Login' });
// export const navigateToHome = () => NavigationActions.navigate({ routeName: 'Home' });
export const openDrawer = () => NavigationActions.navigate({ routeName: 'DrawerOpen' });
export const closeDrawer = () => NavigationActions.navigate({ routeName: 'DrawerClose' });
export const navigateToTimer = () => NavigationActions.navigate({ routeName: 'Timer' });

/* USER */

export const startAuthenticating = () => ({
  type: 'START_AUTHENTICATING',
});

export const userAuthenticated = (user) => ({
  type: 'AUTHENTICATION_SUCCESS',
  emailVerified: user.emailVerified,
  userID: user.uid,
});

export const userAuthenticationFailed = () => ({
  type: 'AUTHENTICATION_FAILURE',
});

export const userAuthenticationRefreshed = () => ({
  type: 'AUTHENTICATION_REFRESHED',
});

export const login = () => {
  const navigate = useNavigate()
  return (dispatch, getState) => {
    dispatch(startAuthenticating());
    firebase.auth().onAuthStateChanged(function (user) {
      if (user === null) {
        // There was an error or there is no user
        dispatch(userAuthenticationFailed());
        dispatch(navigate('/signupflow'));
      } else {
        if (getState().user.userID !== user.uid) {
          dispatch(userAuthenticated(user));
          dispatch(navigate('/teamselectionflow'))
        } else {
          dispatch(userAuthenticationRefreshed());
        }
      }
    });
  };
};

export const startCheckingEmailVerified = () => ({
  type: 'REQUEST_EMAIL_VERIFY',
});

export const emailVerified = () => ({
  type: 'EMAIL_VERIFY_SUCCESS',
});

export const emailNotVerified = () => ({
  type: 'EMAIL_VERIFY_FAILURE',
});

export const emailVerifyError = () => ({
  type: 'EMAIL_VERIFY_ERROR',
});

export const fetchEmailVerified = () => {
  return dispatch => {
    dispatch(startCheckingEmailVerified());
    const user = firebase.auth().currentUser;
    user.reload().then(() => {
      if (user.emailVerified) {
        dispatch(emailVerified());
      } else {
        dispatch(emailNotVerified());
      }
    }).catch((err) => {
      dispatch(emailVerifyError());
    });
  };
};


/* TEAM

   @params
   user: Firebase user ID
   team: Deserialized team object
*/

export const selectTeam = (team) => {
  const navigate = useNavigate();
  return dispatch => {
    dispatch(_selectTeam(team));
    dispatch(listenForPracticeState(team._key));
    dispatch(navigate("/"));
  };
}

export const _selectTeam = (team) => ({
  type: "SELECT_TEAM",
  team,
});

export const requestTeams = (user) => ({
  type: 'REQUEST_TEAMS',
  user,
});

export const receiveTeams = (user, teams) => ({
  type: 'RECEIVE_TEAMS',
  user,
  teams,
});

export const requestTeamsFailed = (user) => ({
  type: 'REQUEST_TEAMS_FAILED',
  user,
});

export const fetchTeams = () => {
  return dispatch => {
    const userID = firebase.auth().currentUser.uid;
    const teamRef = firebase.database().ref('user-teams/' + userID);
    dispatch(requestTeams(userID));
    ModelListener.listenForMultipleValues(teamRef, ModelTransformer.deserializeTeam, (deserializedTeams) => {
      const mappedTeams = deserializedTeams.map(team => ({
        ...team,
        isOwner: team['owner'] == userID,
      }));
      dispatch(receiveTeams(userID, mappedTeams));
    });
  };
};

/* TIMER */

export const viewTimerFullscreen = () => ({
  type: "VIEW_TIMER_FULLSCREEN",
});

export const startListeningPracticeState = (team) => ({
  type: 'LISTEN_PRACTICE_STATE',
  team,
});

export const receivePracticeState = (practiceState, team) => ({
  type: 'RECEIVE_PRACTICE_STATE_SUCCESS',
  team,
  practiceState,
});

export const receivePracticeStateFailed = (team) => ({
  type: 'RECEIVE_PRACTICE_STATE_FAILURE',
  team,
});

// Dispatch receieved practice states to receivePracticeState
export const listenForPracticeState = (teamKey) => {
  return (dispatch) => {
    dispatch(startListeningPracticeState(teamKey));
    const ref = firebase.database().ref('teams/' + teamKey + '/practiceState');
    ModelListener.listenForSingleValue(ref, ModelTransformer.deserializeGeneric, (obj) => {
      dispatch(receivePracticeState(obj, teamKey));
    });
  };
};

export const startCreatingPracticeState = (team) => ({
  type: 'CREATE_PRACTICE_STATE',
  team,
});

export const practiceStateCreated = (practiceState, team) => ({
  type: 'CREATE_PRACTICE_STATE_SUCCESS',
  team,
  practiceState,
});

export const practiceStateCreationFailed = (team) => ({
  type: 'CREATE_PRACTICE_STATE_FAILURE',
  team,
});

// Should make a new practice state, add it to firebase, then dispatch to practiceStateCreated
// Don't do anything if there's currently a practice state
// TODO
/**
 * @param practiceName: String. Name of the practice.
 * @param practiceId: String. Firebase key of the practice object.
 * @param practiceSections: Array of practice section objects.
 * @param travelTimeDuration: Moment duration representing the travel time for the practice.
 */
export const createPracticeState = (practiceName, practiceId, practiceSections, travelTimeDuration) => {
  return (dispatch, getState) => {
    if (!practiceName || !practiceId || !practiceSections || practiceSections.length === 0 || !travelTimeDuration) return;
    const state = getState();
    const team = state.team.selectedTeam._key;
    dispatch(startCreatingPracticeState(team));

    // If there's already an active practice, abort.
    const isActive = state.timer.isActive;
    if (isActive) {
      dispatch(practiceStateCreationFailed());
      return;
    }

    let mappedPracticeSections = [];
    practiceSections.forEach((section) => {
      mappedPracticeSections.push({
        practiceSectionDuration: section.duration.asSeconds(),
        practiceSectionName: section.name,
        practiceSectionNotes: section.notes,
        isTravelTime: false,
      });
      mappedPracticeSections.push({
        practiceSectionDuration: travelTimeDuration.asSeconds(),
        practiceSectionName: "Travel Time",
        isTravelTime: true,
      });
    });
    mappedPracticeSections.pop(); // Remove the last travel time section.

    // Else, create the new active practice.
    let newPracticeState = {
      practiceId: practiceId,
      currentSectionEndTime: moment().add(mappedPracticeSections[0].practiceSectionDuration, 's').unix(),
      currentSectionIndex: 0,
      practiceSections: mappedPracticeSections,
    };
    const ref = firebase.database().ref('teams/' + team + '/practiceState');
    ref.set(newPracticeState, (error) => {
      if (error) {
        dispatch(practiceStateCreationFailed(team));
      } else {
        dispatch(practiceStateCreated(newPracticeState, team));
      }
    });
  };
};

export const _incrementTimer = (endTime) => ({
  type: 'INCREMENT_TIMER',
  endTime,
});

export const _incrementTimerSuccess = (endTime) => ({
  type: 'INCREMENT_TIMER_SUCCESS',
  endTime,
});

export const _incrementTimerFailure = (endTime) => ({
  type: 'INCREMENT_TIMER_FAILURE',
  endTime
});

export const incrementTimer = (increment) => {
  return (dispatch, getState) => {
    const state = getState();
    const team = state.team.selectedTeam._key;

    // If there isn't already an active practice, abort.
    const isActive = state.timer.isActive;
    if (!isActive) {
      dispatch(_incrementTimerFailure());
      return;
    }

    const endTime = moment.unix(state.timer.currentEndTime).add(increment, 's').unix();
    dispatch(_incrementTimer(endTime));

    // Tell Firebase to increment the index
    const updates = {
      ['/currentSectionEndTime']: endTime,
    };
    const ref = firebase.database().ref('teams/' + team + '/practiceState');
    ref.update(updates, (error) => {
      if (error) {
        dispatch(_incrementTimerFailure(endTime));
      } else {
        dispatch(_incrementTimerSuccess(endTime));
      }
    });
  };
};

export const oneMinuteWarning = () => ({
  type: 'ONE_MINUTE_WARNING',
});

export const timerSectionFinished = () => {
  return (dispatch) => {
    dispatch(incrementPracticeSection(1, false));
    dispatch(_timerSectionFinished());
  }
};

export const _timerSectionFinished = () => ({
  type: 'TIMER_SECTION_FINISHED',
});

export const nextSectionIncludingTravelTime = () => {
  return (dispatch) => {
    dispatch(_nextSectionIncludingTravelTime());
    dispatch(incrementPracticeSection(1, false));
  }
};

export const _nextSectionIncludingTravelTime = () => ({
  type: 'NEXT_SECTION_INCLUDING_TRAVEL_TIME',
});

export const prevSectionIncludingTravelTime = () => {
  return (dispatch) => {
    dispatch(_prevSectionIncludingTravelTime());
    dispatch(incrementPracticeSection(-1, false));
  }
};

export const _prevSectionIncludingTravelTime = () => ({
  type: 'PREVIOUS_SECTION_INCLUDING_TRAVEL_TIME',
});

export const nextSectionExcludingTravelTime = () => {
  return (dispatch) => {
    dispatch(_nextSectionExcludingTravelTime());
    dispatch(incrementPracticeSection(1, true));
  }
};

export const _nextSectionExcludingTravelTime = () => ({
  type: 'NEXT_SECTION_EXCLUDING_TRAVEL_TIME',
});

export const prevSectionExcludingTravelTime = () => {
  return (dispatch) => {
    dispatch(_prevSectionExcludingTravelTime());
    dispatch(incrementPracticeSection(-1, true));
  }
};

export const _prevSectionExcludingTravelTime = () => ({
  type: 'PREVIOUS_SECTION_EXCLUDING_TRAVEL_TIME',
});

export const endPractice = () => {
  return (dispatch, getState) => {
    dispatch(_endPractice());
    // Tell Firebase to end the practice
    const team = getState().team.selectedTeam._key;
    const ref = firebase.database().ref('teams/' + team + '/practiceState');
    ref.set(null, (error) => {
      if (error) {
        dispatch(_endPracticeFailure());
      } else {
        dispatch(_endPracticeSuccess());
      }
    });
  }
}

export const _endPractice = () => ({
  type: 'END_PRACTICE',
});

export const _endPracticeSuccess = () => ({
  type: 'END_PRACTICE_SUCCESS',
});

export const _endPracticeFailure = () => ({
  type: 'END_PRACTICE_FAILURE',
});

/**
 * @param increment: Value to increment by; Must be 1 or -1.
 * @param ignoreTravelTime: True to skip travel time sections.
 */
export const incrementPracticeSection = (increment = 1, ignoreTravelTime = false) => {
  return (dispatch, getState) => {
    const state = getState();
    if (!state.timer.practiceSections) return;

    let nextPracticeSectionIndex = state.timer.currentIndex;
    const practiceSectionsLength = state.timer.practiceSections.length;
    let nextIndexWithinBounds;
    // Searches for next non-travel time section, if necessary.
    do {
      nextPracticeSectionIndex = nextPracticeSectionIndex + increment;
      nextIndexWithinBounds =
        nextPracticeSectionIndex < practiceSectionsLength &&
        nextPracticeSectionIndex >= 0;
    } while (
      ignoreTravelTime &&
      nextIndexWithinBounds &&
      state.timer.practiceSections[nextPracticeSectionIndex].isTravelTime
    );

    if (nextPracticeSectionIndex >= practiceSectionsLength) {
      // Index is beyond the end of the practice.
      // End the practice.
      dispatch(endPractice());
    } else if (nextPracticeSectionIndex < 0) {
      // Index is beyond the beginning of the practice.
      // Don't move the position.
      return;
    } else {
      // Index is valid, move to that position.
      const endTime = moment().add(state.timer.practiceSections[nextPracticeSectionIndex].practiceSectionDuration, 's').unix();
      dispatch(_incrementPracticeSection(nextPracticeSectionIndex, endTime));

      // Tell Firebase to increment the index
      const updates = {
        ['/currentSectionEndTime']: endTime,
        ['/currentSectionIndex']: nextPracticeSectionIndex,
      };
      const team = getState().team.selectedTeam._key;
      const ref = firebase.database().ref('teams/' + team + '/practiceState');
      ref.update(updates, (error) => {
        if (error) {
          dispatch(_incrementPracticeSectionFailure(nextPracticeSectionIndex));
        } else {
          dispatch(_incrementPracticeSectionSuccess(nextPracticeSectionIndex));
        }
      });
    }
  }
}

export const _incrementPracticeSection = (sanitizedIndex, endTime) => ({
  type: 'INCREMENT_PRACTICE_SECTION',
  index: sanitizedIndex,
  endTime,
})

export const _incrementPracticeSectionSuccess = (sanitizedIndex) => ({
  type: 'INCREMENT_PRACTICE_SECTION_SUCCESS',
  index: sanitizedIndex,
})

export const _incrementPracticeSectionFailure = (sanitizedIndex) => ({
  type: 'INCREMENT_PRACTICE_SECTION_FAILURE',
  index: sanitizedIndex,
})
