import firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyDiV0uxuZYc25njpvpI_gpBTbu7liZ5JPI",
    authDomain: "project-task-90d2a.firebaseapp.com",
    projectId: "project-task-90d2a",
    storageBucket: "project-task-90d2a.appspot.com",
    messagingSenderId: "1029991306095",
    appId: "1:1029991306095:web:448311160163a13b62ce9a"
};

// Initialize Firebase
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
  }

export default firebase.firestore();
