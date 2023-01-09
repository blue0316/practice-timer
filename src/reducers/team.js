const initialState = {
  loading: false,
  teams: [],
  selectedTeam: {},
};

const team = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_TEAMS':
      return Object.assign({}, state, {
        loading: true,
      });
    case 'RECEIVE_TEAMS':
      return Object.assign({}, state, {
        loading: false,
        teams: action.teams,
      });
    case 'REQUEST_TEAMS_FAILED':
      return Object.assign({}, state, {
        loading: false,
      });
    case 'SELECT_TEAM':
      return Object.assign({}, state, {
        selectedTeam: action.team,
      });
    default:
      return state
  }
};

export default team;
