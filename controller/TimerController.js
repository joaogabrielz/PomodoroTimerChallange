class TimerController {

  constructor() {
    let inputTimer = document.querySelector('#inputTimer');

    this.bind();
  }

  bind() {

    document.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        if(event.target.id === 'btnStartTimer'){
          this.startTimer(event.target);
        }
        else if(event.target.id === 'btnResetTimer'){
          this.resetTimer(event.target);
        }
      })
    })
  }

  startTimer(target) {
    // this.notify();
  }

  resetTimer(target) {

  }

  async notify() {
    try {
      await notifyer.init();
      notifyer.notify({
        title: 'Você finalizou o Pomodoro',
        body: 'Hora do descanço!'
      });
    } catch (error) {
      console.error(error.message);
    }
  }

}