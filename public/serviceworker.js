self.addEventListener("push", (event)=>{
    const {title, body} = JSON.parse(event.data.text());
    event.waitUntil(
        self.registration.showNotification(title, {
            body
        })
    );
});

self.addEventListener("notificationclick", (event)=>{
    self.clients.openWindow('https://manitto.nova.snuaaa.net:9889/');
    //event.notification.close();
})