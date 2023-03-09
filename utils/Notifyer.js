const notifyer = {

  async init() {
    const permission = await Notification.requestPermission();
    if(permission !== 'granted'){
      throw new Error('Permissão Negada');
    }
  },

  notify({ title, body }) {

    document.querySelector('#bellSound').play();
    new Notification(title, {
      body,
      //icon  -- todo incluir icon
    });
  }

}