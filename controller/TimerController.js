class TimerController {
  constructor() {
    this.pageBg = document.querySelector("body");
    this.inputTimer = document.querySelector("#inputTimer");
    this.inputBreakTimer = document.querySelector("#inputBreakTimer");
    this.pomodoroCounter = document.querySelector("#pomodoroCounter");
    this.realTimer = new Timer(0, 0, 0, 0);

    this.secondsDefault = 60;
    this.animationRunning = false;
    this.startWithBreakTimer = false;
    this.bind();
  }

  bind() {
    this.permissionNotify = this.tryPermissionNotify();

    document.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        if (event.target.id === "btnStartTimer") {
          this.startTimer();
        } else if (event.target.id === "btnResetTimer") {
          this.reset();
        }
      });
    });
    
    document.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", (event) => {
        if (event.target.id === "inputBreakTimer") {

         if(event.target.value > 0 && 
          (!this.inputTimer.value || this.inputTimer.value <= 0)){
            this.startWithBreakTimer = true;
          }
          if(!event.target.value || event.target.value <= 0){
            this.startWithBreakTimer = false;
          }
        } 
        else if(event.target.id === "inputTimer") {
          if(event.target.value && event.target.value > 0) {
            this.startWithBreakTimer = false;
          }
        }
      });
    });
  }

  startTimer() {
    let timer = this.inputTimer.value;
    let timerBreak = this.inputBreakTimer.value;

    if (!timer || timer <= 0) {
      const defaultTime = 25;
      let defaultBreak = 5;

      if (timerBreak && timerBreak > 0) {
        defaultBreak = parseInt(timerBreak);
      }

      const timerDefault = new Timer(defaultTime, defaultBreak);
      this.setupRender(timerDefault);

    } else if (timer && timer > 0) {
      
      timer = parseInt(timer);
      let defaultBreak = 5;

      if (timerBreak && timerBreak > 0) {
        defaultBreak = parseInt(timerBreak);
      }
      const typedTime = new Timer(timer, defaultBreak);
      this.setupRender(typedTime);
    }
  }

  setupRender(timer) {
    if (this.realTimer.getPomodoros) {
      timer.pomodoros = this.realTimer.getPomodoros;
    }

    this.inputTimer.type = "text";
    this.inputBreakTimer.type = "text";

    this.inputTimer.value = new TimerView(timer).templateTimer();
    this.inputBreakTimer.value = new TimerView(timer).templateTimerBreak();

    this.inputTimer.readOnly = true;
    this.inputBreakTimer.readOnly = true;

    this.realTimer = timer;

    if(this.startWithBreakTimer){
      this.notify("Você Começou pelo descanço", "", false, false);
      return this.breakTimeDecrementer();
    }
    this.timeDecrementer();
  }

  timeDecrementer() {
    this.animationSolveBreakTime();

    this.realTimer.setSeconds = this.secondsDefault;
    this.realTimer.setTime = this.realTimer.getTime - 1;
    let isBreakTime = false;

    const temporizer = setInterval(() => {

      if (isBreakTime) {
        clearInterval(temporizer);
        return;
      }
      if (this.realTimer.isReseted()) {
        clearInterval(temporizer);
        return;
      }

      this.realTimer.decrementSeconds();
      this.renderTimer(this.realTimer);


      if (this.realTimer.getSeconds == 0) {
        this.realTimer.decrementTime();

        if (this.realTimer.getTime == 0) {
          isBreakTime = true;

          this.notify("Você finalizou o Pomodoro", "Hora do descanço!");
          this.renderTimer(this.realTimer);
          this.breakTimeDecrementer();
          return;
        }

        this.realTimer.setSeconds = this.secondsDefault;
      }
    }, 1000);
  }

  animationSolveBreakTime() {
    this.inputBreakTimer.classList.add("blink");
    this.animationRunning = setTimeout(() => {
      this.inputBreakTimer.classList.add("display-none");
      this.inputBreakTimer.classList.remove("blink");
    }, 800);
    this.pageBg.style.backgroundColor = "#BA4949";
  }

  renderTimer(timerUpdated) {
    this.inputTimer.value = new TimerView(timerUpdated).templateTimer();
  }

  breakTimeDecrementer() {
    this.animationSolvePomodoro();

    this.realTimer.setSeconds = this.secondsDefault;
    this.realTimer.setBreakTime = this.realTimer.getBreakTime - 1;
    let isPomodoroTime = false;

    const temporizer = setInterval(() => {

      if (isPomodoroTime) {
        clearInterval(temporizer);
        return;
      }
      if (this.realTimer.isReseted()) {
        clearInterval(temporizer);
        return;
      }

      this.realTimer.decrementSeconds();
      this.renderBreakTime(this.realTimer);

      if (this.realTimer.getSeconds == 0) {
        this.realTimer.decrementBreakTime();

        if (this.realTimer.getBreakTime == 0) {

          isPomodoroTime = true;
          this.renderBreakTime(this.realTimer);
          
          if(!this.startWithBreakTimer) {
            this.realTimer.incrementPomodoroCounter();
            this.renderPomodoroCounter();

            if (this.realTimer.getPomodoros == 4) {
              this.sendPomodoroSuggestion();
            } else{
              this.notify(
                "Você finalizou o tempo de descanço",
                "Hora do Pomodoro!",
                true
              );
            }

          }
          else{
            this.notify(
              "Você finalizou o tempo de descanço",
              "Que tal começar com o Pomodoro?",
              false,
            );
          }
                 
          this.reset();       
        }

        this.realTimer.setSeconds = this.secondsDefault;
      }
    }, 1000);
  }

  animationSolvePomodoro() {
    this.inputTimer.classList.add("blink");

    this.inputBreakTimer.classList.remove("display-none");
    this.inputBreakTimer.classList.add("display-inlineBlock");
    this.inputBreakTimer.classList.add("expandText");

    this.animationRunning = setTimeout(() => {
      this.inputTimer.classList.add("display-none");
      this.inputTimer.classList.remove("blink");
    }, 800);

    this.pageBg.style.backgroundColor = "#38858A";
  }

  renderBreakTime(timerUpdated) {
    this.inputBreakTimer.value = new TimerView(
      timerUpdated
    ).templateTimerBreak();
  }

  renderPomodoroCounter() {
    if (this.pomodoroCounter.classList.contains("display-none")) {
      this.pomodoroCounter.classList.remove("display-none");
    }
    this.pomodoroCounter.innerText = new TimerView(
      this.realTimer
    ).templatePomodoroNotify();
  }

  sendPomodoroSuggestion() {
    this.notify(
      "Parabéns você completou 4 pomodoros",
      "Tente descançar 10 minutos",
      true
    );
    document.querySelector("#inputBreakTimer").placeholder = 10;
  }

  notify(title, body, doubleBell = false, playSong = true) {
    
    if(this.permissionNotify){
      notifyer.notify({
        title,
        body,
        doubleBell,
        playSong,
      });
    }
    
  }

  async tryPermissionNotify(){
    try {
      this.permissionNotify = await notifyer.init();
    } 
    catch (error) {
      console.error(error.message);
    } 
  }

  reset() {
    this.resetCss();
    this.startWithBreakTimer = false;

    if (this.realTimer.getPomodoros > 0) {
      this.realTimer = new Timer(0, 0, this.realTimer.getPomodoros, 0);
    } else {
      this.realTimer = new Timer(0, 0, 0, 0);
    }

    this.resetInputs();
  }

  resetCss() {
    clearTimeout(this.animationRunning);
    this.animationRunning = null;
    this.pageBg.style.backgroundColor = "#397097";
    this.inputTimer.className = "";
    this.inputBreakTimer.className = "";
  }

  resetInputs() {
    this.inputTimer.value = "";
    this.inputBreakTimer.value = "";
    this.inputTimer.type = "number";
    this.inputBreakTimer.type = "number";

    this.inputTimer.readOnly = false;
    this.inputBreakTimer.readOnly = false;
  }
}
