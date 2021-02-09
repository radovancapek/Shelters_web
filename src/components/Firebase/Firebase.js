import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyC1HRdQrfh3bkj7AqhkVjUhecnEJzY99oc",
    authDomain: "shelters-2932f.firebaseapp.com",
    databaseURL: "https://shelters-2932f.firebaseio.com",
    projectId: "shelters-2932f",
    storageBucket: "shelters-2932f.appspot.com",
    messagingSenderId: "251262745088",
    appId: "1:251262745088:web:558272359da8756cfe76e5",
    measurementId: "G-P4LCCYGKCF"
};
export const firebaseApp = firebase.initializeApp(config);

export const db = firebase.firestore();
export const storage = firebase.storage();
export const auth = firebase.auth();
