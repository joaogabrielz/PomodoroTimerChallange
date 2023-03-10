const notifyer = {

  async init() {
    const permission = await Notification.requestPermission();
    if(permission !== 'granted'){
      throw new Error('Permissão Negada');
    }
  },

  notify({ title, body }) {

    const icon = './assets/imgs/favicon-32x32.png' 

    document.querySelector('#bellSound').play();
    
    const notification = new Notification(title, {
      body,
      icon
    });

    navigator.serviceWorker.register('sw.js');
    navigator.serviceWorker.ready.then(function(registration) {
      registration.showNotification(notification);
    });

  }

}