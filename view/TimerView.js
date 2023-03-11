class TimerView {

  constructor(timer) {
    this.timer = timer;
  }

  templateTimer() {
    return `${parseInt(this.timer.getTime)}:${this.timer.getSeconds > 9 ? 
      this.timer.getSeconds : '0' + this.timer.getSeconds}`;
  }
  templateTimerBreak() {
    return `${parseInt(this.timer.getBreakTime)}:${this.timer.getSeconds > 9 ? 
      this.timer.getSeconds : '0' + this.timer.getSeconds}`;
  }

  templatePomodoroNotify() {
    return `${this.timer.getPomodoros}`;
  }
}