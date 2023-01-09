import { Suspense, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Splash from './components/Splash';
import SignUpFlow from "./flows/SignUpFlow";

import SignIn from "./screens/SignUpFlow/SignIn";
import SignUp from "./screens/SignUpFlow/SignUp";
import firebase from './services/firebase';

const App = (props) => {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (user === null) {
  //       handleUserUpdateEvent(null);
  //       console.log('USER IS NOT AUTHENTICTED');
  //     } else {
  //       handleUserUpdateEvent(user);
  //       console.log('USER *IS* AUTHENTICTED');
  //     }
  //   });
  // },[]);

  // const handleUserUpdateEvent = (userDetails) => {
  //   if (userDetails) {
  //     if (userDetails.currentTeamId != null) {
  //       navigate({ pathname: '/mainflow' });
  //     } else {
  //       navigate({ pathname: '/teamselectionflow' });
  //     }
  //   } else {
  //     navigate({ pathname: '/sign-in' });
  //   }
  // }

  return (
      <div>
        <Routes>
          <Route path="/" exact element={<Splash />} />
          <Route path="/sign-in" element={<SignIn firebase={firebase} />} />
          <Route path="/sign-up" element={<SignUp firebase={firebase} />} />
          <Route path="/signupflow" element={<SignUpFlow />} />
          {/* <Route path="/teamselectionflow" component={TeamSelectionFlow} /> */}
          {/* <Route path="/mainflow" component={MainFlowCurrentPracticeHeader}>
            <Route path="/mainflow" component={MainFlow} />
          </Route> */}
        </Routes>
      </div>
  );
}

export default App;