import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyCIdqFZTi2BtraFw5RXbal9gIxbJ2QeJyQ",
  authDomain: "football-timer-fbe03.firebaseapp.com",
  databaseURL: "https://football-timer-fbe03.firebaseio.com",
  projectId: "football-timer-fbe03",
  storageBucket: "football-timer-fbe03.appspot.com",
  messagingSenderId: "1002121646518",
  debug: true
};
firebase.initializeApp(firebaseConfig);

export default firebase;
