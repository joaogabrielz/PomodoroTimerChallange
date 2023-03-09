class Timer {

  constructor(time, breakTime, pomodoros = 0, seconds = 59) {
    this.time = time;
    this.breakTime = breakTime;
    this.pomodoros = pomodoros;
    this.seconds = seconds;
  }

  get getTime() {
    return this.time;
  }
  get getBreakTime() {
    return this.breakTime;
  }
  get getPomodoros() {
    return this.pomodoros;
  }
  get getSeconds() {
    return this.seconds;
  }

  set setTime(time) {
    this.time = time;
  }
  set setBreakTime(breakTime) {
    this.breakTime = breakTime;
  }
  set setPomodoros(pomodoros) {
    this.pomodoros = pomodoros;
  }
  set setSeconds(seconds) {
    this.seconds = seconds;
  }


  decrementTime(){
    if(this.time == 0) return;
    this.time--;
  }

  decrementBreakTime(){
    if(this.breakTime == 0) return;
    this.breakTime--;
  }

  decrementSeconds(){
    if(this.seconds == 0) return;
    this.seconds--;
  }

  incrementPomodoro() {
    this.pomodoros++;
  }

  isReseted() {
    if(this.breakTime == 0 &&
      this.time == 0 &&
      this.seconds == 0){
        return true;
      }
    return false;
  }
}