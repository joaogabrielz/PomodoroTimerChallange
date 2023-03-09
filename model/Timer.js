class Timer {

  constructor(time, breakTime) {
    this.time = time;
    this.breakTime = breakTime;
    this.pomodoros = 0;
  }

  get getTime() {
    return this.time;
  }
  get getBreakTime() {
    return this.breakTime;
  }
  get pomodoros() {
    return this.pomodoros;
  }

  set setTime(time) {
    this.time = time;
  }
  set setBreakTime(breakTime) {
    this.breakTime = breakTime;
  }


  incrementPomodoro() {
    this.pomodoros++;
  }

}