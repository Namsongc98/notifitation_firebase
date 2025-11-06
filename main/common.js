import "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import "https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging.js";
import "https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLyi67O-AUbdXZK1wdM0F5Vvi_couK6u0",
  authDomain: "projectdemo-ad6dd.firebaseapp.com",
  databaseURL: "https://projectdemo-ad6dd-default-rtdb.firebaseio.com",
  projectId: "projectdemo-ad6dd",
  storageBucket: "projectdemo-ad6dd.appspot.com",
  messagingSenderId: "859784439972",
  appId: "1:859784439972:web:5c736ee89e4843c5c85e31",
  measurementId: "G-RGPXLLCE1Z",
};

const app = firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.onMessage((payload) => {
  alert("có thông báo");
  console.log("payload", payload);
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered:', registration);

      // Gọi FCM sau khi đăng ký SW thành công
      requestPermission(registration);
    })
    .catch((err) => {
      console.error('Service Worker registration failed:', err);
    });
} else {
  console.error('Service Worker not supported');
}

function requestPermission(registration) {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      messaging
        .getToken({
          vapidKey:
            // "BDOGuu7fbPOAvxA2binH6m_7_61rt3e8UYIV-frFFGU5D5tlu8DQOUtMG7Vbj7wexPGVi2wx_xS6jWUqFWTjjWE",
            "BBxKDa6LBhfa5fdd9Y8q2ZsAkmMVB8pHbiMpCIj-zRCeNjhueOV25muKTkR0S_9R-HnLZGhpi1PoWtZowNLu4dY",
            serviceWorkerRegistration: registration,
        })
        .then((currentToken) => {
          if (currentToken) {
            console.log(currentToken);
            sendTokenToServer(currentToken);
          } else {
            // Show permission request UI
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        })
        .catch((err) => {
          console.log(err);
          setTokenSentToServer(false);
        });
    } else {
      alert("hãy bật thông báo để không bỏ lỡ điều gì");
    }
  });
}


function sendTokenToServer() {
  if (!isTokenSentToServer()) {
    console.log("Sending token to server ...");
    setTokenSentToServer(true);
  } else {
    console.log("Token already available in the server");
  }
}
function isTokenSentToServer() {
  return window.localStorage.getItem("sentToServer") === "1";
}
function setTokenSentToServer(sent) {
  window.localStorage.setItem("sentToServer", sent ? "1" : "0");
}
