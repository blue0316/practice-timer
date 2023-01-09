import moment from 'moment';

const initialState = {
  loading: false,
  isListening: false,
  isActive: false, // if the timer is active, it should be visible.
  isWithinOneMinute: false,
  currentEndTime: null,
  currentIndex: null,
  practiceSections: [],
  practiceName: "Test Practice",
};

/** Shape for practiceSections
practiceSections: [
  {
    practiceSectionEndTime: some unix time,
    practiceSectionName: "Head Coach: Core Beliefs",
    practiceSectionNotes: {
      some_user_id: "My Notes",
    },
    isTravelTime: false,
  },
  {
    practiceSectionEndTime: some unix time,
    practiceSectionName: "Travel Time",
    isTravelTime: true,
  },
]
*/

const timer = (state = initialState, action) => {
  switch (action.type) {
    case 'LISTEN_PRACTICE_STATE':
      return Object.assign({}, state, {
        loading: true,
        isListening: true,
      });
    case 'CREATE_PRACTICE_STATE':
      return Object.assign({}, state, {
        loading: true,
      });
    case 'RECEIVE_PRACTICE_STATE_SUCCESS':
    case 'CREATE_PRACTICE_STATE_SUCCESS':
      if (action.practiceState && action.practiceState.practiceSections) {
        const now = moment();
        // We need to search for the next valid end time (i.e. the next
        // end time that is not in the past.
        let currentIndex = action.practiceState.currentSectionIndex;
        let calculatedEndTime = moment.unix(action.practiceState.currentSectionEndTime);
        const practiceSections = action.practiceState.practiceSections;
        while (!now.isBefore(calculatedEndTime) && currentIndex + 1 < practiceSections.length) {
          currentIndex = currentIndex + 1;
          const nextDuration = practiceSections[currentIndex].practiceSectionDuration;
          calculatedEndTime = calculatedEndTime.add(nextDuration, 's');
        }
        let currentEndTime = calculatedEndTime.unix();
        // If we haven't run off the end of the array, we're good to go.
        if (currentIndex < practiceSections.length) {
          return Object.assign({}, state, {
            loading: false,
            isActive: true,
            currentEndTime: currentEndTime,
            currentIndex: currentIndex,
            practiceSections: practiceSections,
          });
        }
        // Else, fall thru to the null state
      }
      return Object.assign({}, state, {
        loading: false,
        isActive: false,
        currentEndTime: null,
        currentIndex: null,
        practiceSections: [],
      });
    case 'RECEIVE_PRACTICE_STATE_FAILURE':
    case 'CREATE_PRACTICE_STATE_FAILURE':
      return Object.assign({}, state, {
        loading: false,
      });
    case 'ONE_MINUTE_WARNING':
      return Object.assign({}, state, {
        isWithinOneMinute: true,
      });
    case 'INCREMENT_TIMER':
      if (!state.currentEndTime) return state;
      return Object.assign({}, state, {
        currentEndTime: moment(state.currentEndTime).add(action.increment, 's').unix(),
      });
    case 'INCREMENT_PRACTICE_SECTION':
      return Object.assign({}, state, {
        currentIndex: action.index,
        currentEndTime: action.endTime,
        isWithinOneMinute: false,
      });
    case 'END_PRACTICE':
      return Object.assign({}, state, {
        currentIndex: null,
        currentEndTime: null,
        isActive: false,
        isWithinOneMinute: false,
      });
    default:
      return state
  }
};

export default timer;
