import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import firebase from '../services/firebase';

const Layout = (props) => {
    const navigate = useNavigate();
    useEffect(() => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user === null) {
          handleUserUpdateEvent(null);
          console.log('USER IS NOT AUTHENTICTED');
        } else {
          handleUserUpdateEvent(user);
          console.log('USER *IS* AUTHENTICTED');
        }
      });
    },[]);
  
    const handleUserUpdateEvent = (userDetails) => {
      if (userDetails) {
        if (userDetails.currentTeamId != null) {
          navigate({ pathname: '/mainflow' });
        } else {
          navigate({ pathname: '/teamselectionflow' });
        }
      } else {
        navigate({ pathname: '/sign-in' });
      }
    }

    return (
        <div>{props.children}</div>
    )
}

export default Layout