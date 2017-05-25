import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyBLm0236leugVADAEn6ZU9fDZx6qFgMpYA",
    authDomain: "unagauchada-a8bae.firebaseapp.com",
    databaseURL: "https://unagauchada-a8bae.firebaseio.com",
    projectId: "unagauchada-a8bae",
    storageBucket: "unagauchada-a8bae.appspot.com",
    messagingSenderId: "75500322492"
};

try {
    firebase.initializeApp(config);
} catch (err) {
  // we skip the "already exists" message which is
  // not an actual error when we're hot-reloading
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
  }
}

const rootRef = firebase.database().ref()

export default rootRef
export const app = firebase.app()
