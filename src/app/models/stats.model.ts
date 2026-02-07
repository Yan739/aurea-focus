export interface Statistics {
    todaySessions: number;
    totalTime: number;
    currentStreak: number;
    productivity: number;
    sessionHistory: SessionRecord[];
}

export interface SessionRecord {
    date: string;
    mode: string;
    duration: number;
    completed: boolean;
}