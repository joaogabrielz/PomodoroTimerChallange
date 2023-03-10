class TimerController {

  constructor() {
    this.pageBg = document.querySelector('body');
    this.inputTimer = document.querySelector('#inputTimer');
    this.inputBreakTimer = document.querySelector('#inputBreakTimer');
    this.realTimer = new Timer(0, 0, 0, 0);

    this.bind();
  }

  bind() {
    document.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        if(event.target.id === 'btnStartTimer'){
          this.startTimer();
        }
        else if(event.target.id === 'btnResetTimer'){
          this.reset();
        }
      })
    })
  }

  setupRender(timer) {
    if(this.realTimer.getPomodoros) timer.pomodoros = this.realTimer.getPomodoros;

    this.inputTimer.type = 'text';
    this.inputBreakTimer.type = 'text';

    this.inputTimer.value = new TimerView(timer).templateTimer();
    this.inputBreakTimer.value = new TimerView(timer).templateTimerBreak();

    this.inputTimer.readOnly = true;
    this.inputBreakTimer.readOnly = true;

    this.realTimer = timer;
    this.timeDecrementer();
  }

  renderPomodoro(timerUpdated) {
    this.inputTimer.value = new TimerView(timerUpdated).templateTimer();
  }

  renderBreakTime(timerUpdated){
    this.inputBreakTimer.value = new TimerView(timerUpdated).templateTimerBreak();
  }

  timeDecrementer() {
    this.pageBg.style.backgroundColor  = '#BA4949';

    this.realTimer.setSeconds = 60;
    this.realTimer.setTime = this.realTimer.getTime - 1;

    let isBreakTime = false;

    const temporizer = setInterval(() => {

      if(isBreakTime) {
        clearInterval(temporizer)
        return;
      };
      if(this.realTimer.isReseted()) {
        clearInterval(temporizer);
        return;
      };

      this.realTimer.decrementSeconds();
      this.renderPomodoro(this.realTimer);    

        if(this.realTimer.getSeconds == 0){

          this.realTimer.decrementTime();

          if(this.realTimer.getTime == 0) {
            
            this.realTimer.incrementPomodoro();

            isBreakTime = true;
            this.notify('Você finalizou o Pomodoro', 'Hora do descanço!');
            this.renderPomodoro(this.realTimer);
            this.breakTimeDecrementer();
            return;
          }
          
          this.realTimer.setSeconds = 60;
        }

    }, 1000);
 
  }

  breakTimeDecrementer() {
    this.pageBg.style.backgroundColor  = '#38858A';

    this.realTimer.setSeconds = 60;
    this.realTimer.setBreakTime = this.realTimer.getBreakTime - 1;

    let isPomodoroTime = false;

    const temporizer = setInterval(() => {

      if(isPomodoroTime) {
        clearInterval(temporizer)
        return;
      };

      this.realTimer.decrementSeconds();
      this.renderBreakTime(this.realTimer);    

        if(this.realTimer.getSeconds == 0){

          this.realTimer.decrementBreakTime();

          if(this.realTimer.getBreakTime == 0) {
            
            isPomodoroTime = true;
            this.notify('Você finalizou o tempo de descanço', 'Hora do Pomodoro!', true);
            this.renderBreakTime(this.realTimer);
            this.reset(); 
            if(this.realTimer.getPomodoros == 4){
              this.sendPomodoroSuggestion();
            }        
          }
        
        this.realTimer.setSeconds = 60;
        }

    }, 1000);

   
  }


  sendPomodoroSuggestion() {
    this.notify('Parabéns você completou 4 pomodoros', 'Tente descançar 10 minutos');
    document.querySelector('#inputBreakTimer').placeholder = 10;
  }
  
  startTimer() {
    let timer = document.querySelector('#inputTimer').value;
    let timerBreak = document.querySelector('#inputBreakTimer').value;
 
    if(!timer || timer <= 0){

      const defaultTime = 25;
      let defaultBreak = 5;

      if(timerBreak && timerBreak > 0) {
        defaultBreak = parseInt(timerBreak);
      }

      const timerDefault = new Timer(defaultTime, defaultBreak);
      this.setupRender(timerDefault);
    }
    else if(timer && timer > 0){
      timer = parseInt(timer);
      let defaultBreak = 5;

      if(timerBreak && timerBreak > 0) {
        defaultBreak = parseInt(timerBreak);
      }
      const typedTime = new Timer(timer, defaultBreak);
      this.setupRender(typedTime);
    }
  }


  reset() {
    this.pageBg.style.backgroundColor = '#397097';

    if(this.realTimer.getPomodoros > 0) {
      this.realTimer = new Timer(0, 0, this.realTimer.getPomodoros, 0);
    }
    else{
      this.realTimer = new Timer(0, 0, 0, 0);
    }
    this.inputTimer.value = '';
    this.inputBreakTimer.value = '';
    this.inputTimer.type = 'number';
    this.inputBreakTimer.type = 'number';

    this.inputTimer.readOnly = false;
    this.inputBreakTimer.readOnly = false;
  }
  

  async notify(title, body, doubleBell = false) {

    try {
      notifyer.notify({
        title,
        body,
        doubleBell
      });
    } 
    catch (error) {
      console.error(error.message);
    }
  }

}