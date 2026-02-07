export enum TimerMode {
    WORK = 'work',
    SHORT_BREAK = 'break',
    LONG_BREAK = 'long'
}

export interface TimerSettings{
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    soundEnabled: boolean;
    autoStartBreaks: boolean;
    deepFocusMode: boolean;
}

export interface TimerState {
    mode: TimerMode;
    timeLeft: number;
    totalTime: number;
    isRunning: boolean;
    sessionsCompleted: number;
}