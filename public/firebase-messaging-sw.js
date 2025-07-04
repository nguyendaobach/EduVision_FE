// Firebase messaging service worker for EduVision
console.log("Firebase messaging service worker loaded");

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js"
);

try {
  firebase.initializeApp({
    apiKey: "AIzaSyCXvxPo7IhiWrJ2wIEZO8u-bVYhv8-_rmA",
    authDomain: "eduvision-7d79b.firebaseapp.com",
    projectId: "eduvision-7d79b",
    storageBucket: "eduvision-7d79b.appspot.com",
    messagingSenderId: "859564462424",
    appId: "1:859564462424:web:961e9e2cf62567e8c1d52d",
    measurementId: "G-0TVY392QN7",
  });

  const messaging = firebase.messaging();
  console.log("Firebase messaging initialized in service worker");

  messaging.onBackgroundMessage(function (payload) {
    console.log("Received background message ", payload);

    let notificationTitle = payload.notification?.title || "EduVision";
    let notificationBody = payload.notification?.body;
    let notificationOptions = {
      icon: "/vite.svg", // Đổi icon nếu muốn
      data: payload.data,
      requireInteraction: true,
    };

    if (payload.data?.type === "slide_generated") {
      notificationBody =
        notificationBody || "Slide mới đã được tạo! Click để xem.";
      notificationOptions.actions = [
        { action: "view_slide", title: "Xem Slide" },
        { action: "close", title: "Đóng" },
      ];
    } else if (payload.data?.type === "video_generated") {
      notificationBody =
        notificationBody || "Video mới đã được tạo! Click để xem.";
      notificationOptions.actions = [
        { action: "view_video", title: "Xem Video" },
        { action: "close", title: "Đóng" },
      ];
    } else if (payload.data?.type === "slide_and_video_generated") {
      notificationBody =
        notificationBody || "Slide và Video đã được tạo! Click để xem.";
      notificationOptions.actions = [
        { action: "view_slide", title: "Xem Slide" },
        { action: "view_video", title: "Xem Video" },
        { action: "close", title: "Đóng" },
      ];
    } else {
      notificationBody = notificationBody || "Bạn có thông báo mới!";
      notificationOptions.actions = [];
    }

    notificationOptions.body = notificationBody;
    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  // Xử lý khi user click vào notification
  self.addEventListener("notificationclick", function (event) {
    console.log("Notification clicked:", event);
    event.notification.close();

    const data = event.notification.data;
    if (event.action === "") {
      if (data?.type === "slide_generated" && data.slideUrl) {
        event.waitUntil(clients.openWindow(data.slideUrl));
      } else if (data?.type === "video_generated" && data.videoUrl) {
        event.waitUntil(clients.openWindow(data.videoUrl));
      } else if (data?.type === "slide_and_video_generated") {
        if (data.slideUrl) {
          event.waitUntil(clients.openWindow(data.slideUrl));
        }
      }
    } else if (event.action === "view_slide" && data?.slideUrl) {
      event.waitUntil(clients.openWindow(data.slideUrl));
    } else if (event.action === "view_video" && data?.videoUrl) {
      event.waitUntil(clients.openWindow(data.videoUrl));
    }
    // Action 'close' sẽ chỉ đóng notification
  });
} catch (error) {
  console.error("Error initializing Firebase in service worker:", error);
}
