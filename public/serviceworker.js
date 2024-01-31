self.addEventListener("push", (event)=>{
    const message = event.data.text();
    event.waitUntil(
        self.registration.showNotification(message, {
            body: message
        })
    );
});

self.addEventListener("notificationclick", (event)=>{
    self.clients.openWindow('http://localhost:3000');
    //event.notification.close();
})