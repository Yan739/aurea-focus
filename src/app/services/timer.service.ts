import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { TimerMode, TimerSettings, TimerState } from '../models/timer.model';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private defaultSettings: TimerSettings = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    soundEnabled: true,
    autoStartBreaks: false,
    deepFocusMode: false
  };

  private timerStateSubject = new BehaviorSubject<TimerState>({
    mode: TimerMode.WORK,
    timeLeft: 25 * 60,
    totalTime: 25 * 60,
    isRunning: false,
    sessionsCompleted: 0
  });

  private settingsSubject = new BehaviorSubject<TimerSettings>(this.defaultSettings);
  private timerSubscription?: Subscription;

  public timerState$: Observable<TimerState> = this.timerStateSubject.asObservable();
  public settings$: Observable<TimerSettings> = this.settingsSubject.asObservable();

  constructor() {
    this.loadSettings();
  }

  private loadSettings(): void {
    const stored = localStorage.getItem('aureaFocusSettings');
    if (stored) {
      const settings = JSON.parse(stored);
      this.settingsSubject.next(settings);
      this.updateTimerDuration(this.timerStateSubject.value.mode);
    }
  }

  public updateSettings(settings: TimerSettings): void {
    this.settingsSubject.next(settings);
    localStorage.setItem('aureaFocusSettings', JSON.stringify(settings));
    
    if (!this.timerStateSubject.value.isRunning) {
      this.updateTimerDuration(this.timerStateSubject.value.mode);
    }
  }

  public changeMode(mode: TimerMode): void {
    if (this.timerStateSubject.value.isRunning) return;

    this.updateTimerDuration(mode);
    this.timerStateSubject.next({
      ...this.timerStateSubject.value,
      mode
    });
  }

  private updateTimerDuration(mode: TimerMode): void {
    const settings = this.settingsSubject.value;
    let duration: number;

    switch (mode) {
      case TimerMode.WORK:
        duration = settings.workDuration * 60;
        break;
      case TimerMode.SHORT_BREAK:
        duration = settings.shortBreakDuration * 60;
        break;
      case TimerMode.LONG_BREAK:
        duration = settings.longBreakDuration * 60;
        break;
    }

    this.timerStateSubject.next({
      ...this.timerStateSubject.value,
      timeLeft: duration,
      totalTime: duration
    });
  }

  public start(): void {
    if (this.timerStateSubject.value.isRunning) return;

    this.timerStateSubject.next({
      ...this.timerStateSubject.value,
      isRunning: true
    });

    this.timerSubscription = interval(1000).subscribe(() => {
      const state = this.timerStateSubject.value;
      const newTimeLeft = state.timeLeft - 1;

      if (newTimeLeft <= 0) {
        this.complete();
      } else {
        this.timerStateSubject.next({
          ...state,
          timeLeft: newTimeLeft
        });
      }
    });
  }

  public pause(): void {
    this.timerSubscription?.unsubscribe();
    this.timerStateSubject.next({
      ...this.timerStateSubject.value,
      isRunning: false
    });
  }

  public reset(): void {
    this.pause();
    this.updateTimerDuration(this.timerStateSubject.value.mode);
  }

  private complete(): void {
    this.pause();
    
    const state = this.timerStateSubject.value;
    let sessionsCompleted = state.sessionsCompleted;

    if (state.mode === TimerMode.WORK) {
      sessionsCompleted++;
    }

    this.timerStateSubject.next({
      ...state,
      sessionsCompleted
    });


    if (this.settingsSubject.value.autoStartBreaks) {
      setTimeout(() => this.autoTransition(), 3000);
    }
  }

  private autoTransition(): void {
    const state = this.timerStateSubject.value;
    let nextMode: TimerMode;

    if (state.mode === TimerMode.WORK) {
      nextMode = state.sessionsCompleted % 4 === 0 
        ? TimerMode.LONG_BREAK 
        : TimerMode.SHORT_BREAK;
    } else {
      nextMode = TimerMode.WORK;
    }

    this.changeMode(nextMode);
    this.start();
  }

  public getProgress(): number {
    const state = this.timerStateSubject.value;
    return ((state.totalTime - state.timeLeft) / state.totalTime) * 100;
  }
}