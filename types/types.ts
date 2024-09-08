export interface WorkoutData {
    Date: string;
    "Workout Name": string;
    Duration: string;
    "Exercise Name": string;
    "Set Order": string;
    Weight: string;
    Reps: string;
    Distance: string;
    Seconds: string;
    Notes: string;
    "Workout Notes": string;
    RPE: string;
}

export interface FrequencyData {
    month: string;
    count: number;
}

export interface ExerciseData {
    name: string;
    count: number;
}