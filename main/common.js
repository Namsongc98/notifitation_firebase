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
   const { title, body } = payload.notification;
  showIncomingMessageNotification(title, body);
  console.log("onMessage",title, body)

});

/**
 * Hiển thị thông báo FCM khi web đang mở (foreground)
 * @param {string} title - Tiêu đề thông báo
 * @param {string} body - Nội dung thông báo
 * @param {string} [icon='/icon.png'] - Icon hiển thị trong thông báo
 */
function showIncomingMessageNotification(title, body, icon = '/icon.png') {
  // Kiểm tra quyền hiển thị thông báo
  if (Notification.permission === "granted") {
    // Nếu user đã cho phép, hiển thị thông báo
    new Notification(title, {
      body: body,
      icon: icon,
      tag: "chat-message", // để các thông báo cùng loại gộp chung
      renotify: true
    });
  } else if (Notification.permission !== "denied") {
    // Nếu chưa hỏi quyền, xin phép người dùng
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, {
          body: body,
          icon: icon
        });
      } else {
        // Nếu user từ chối
        alert(`${title}\n${body}`);
      }
    });
  } else {
    // Nếu user đã chặn thông báo → fallback alert
    alert(`${title}\n${body}`);
  }
}

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
            console.log('currentToken :::::::::: ',currentToken);
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
