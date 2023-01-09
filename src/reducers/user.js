const initialState = {
  authenticating: false,
  authenticated: false,
  emailVerified: false,
  isVerifyingEmail: false,
  userID: null,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'START_AUTHENTICATING':
      return Object.assign({}, state, {
        authenticating: true,
      });
    case 'AUTHENTICATION_SUCCESS':
      return Object.assign({}, state, {
        authenticating: false,
        authenticated: true,
        emailVerified: action.emailVerified,
        userID: action.userID,
      });
    case 'AUTHENTICATION_FAILURE':
      return Object.assign({}, state, {
        authenticating: false,
        authenticated: false,
        emailVerified: false,
        userID: null,
      });
    case 'SEND_EMAIL_VERIFICATION':
      return state;
    case 'REQUEST_EMAIL_VERIFY':
      return Object.assign({}, state, {
        isVerifyingEmail: true,
      });
    case 'EMAIL_VERIFY_SUCCESS':
      return Object.assign({}, state, {
        emailVerified: true,
        isVerifyingEmail: false,
      });
    case 'EMAIL_VERIFY_FAILURE':
    case 'EMAIL_VERIFY_ERROR':
      return Object.assign({}, state, {
        emailVerified: false,
        isVerifyingEmail: false,
      });
    default:
      return state
  }
};

export default user;
