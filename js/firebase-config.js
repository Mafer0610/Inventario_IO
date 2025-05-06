const firebaseConfig = {
    apiKey: "AIzaSyBHC5snNSIkl_6dH2PixazKCS_SxmG14vE",
    authDomain: "inventario-io.firebaseapp.com",
    databaseURL: "https://inventario-io-default-rtdb.firebaseio.com",
    projectId: "inventario-io",
    storageBucket: "inventario-io.appspot.com",
    messagingSenderId: "1006433004056",
    appId: "1:1006433004056:web:9450d28b621898842db16d"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

const database = firebase.database();

export { database };