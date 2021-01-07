import firebase from 'firebase/app';
import "firebase/auth";
import 'firebase/database';
import "firebase/storage";
import 'firebase/analytics'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyAi_kKOFMaDKqTamyIVqLGNgJ2N9560KCQ",
    authDomain: "fun-chart.firebaseapp.com",
    projectId: "fun-chart",
    storageBucket: "fun-chart.appspot.com",
    messagingSenderId: "463831305572",
    appId: "1:463831305572:web:8797960980effe8150fe71",
    measurementId: "G-ETT46STVL5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;