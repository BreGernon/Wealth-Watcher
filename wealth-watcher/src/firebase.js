import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDiBSaSmqH6VF_Gd6qFiOhX0INEw_GKAgs",
    authDomain: "wealth-watcher-a5747.firebaseapp.com",
    projectId: "wealth-watcher-a5747",
    storageBucket: "wealth-watcher-a5747.appspot.com",
    messagingSenderId: "468586607471",
    appId: "1:468586607471:web:4dbac8601875907cea2e9a",
    measurementId: "G-5RWMXB588B"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);