import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { WorkoutData, FrequencyData, ExerciseData } from "@/types/types";
import { format, parse } from "date-fns";

export function processCSV(csvText: string) {
  const lines = csvText.split("\n");
  const headers = lines[0].split(",");
  const parsedData: WorkoutData[] = lines.slice(1).map((line) => {
    const values = line.split(",");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return headers.reduce((obj: any, header, index) => {
      obj[header.trim()] = values[index];
      return obj;
    }, {});
  });

  // Process workout frequency by month
  const workoutCounts: { [key: string]: number } = {};
  parsedData.forEach((row) => {
    try {
      const datePart = row.Date.split(" ")[0];
      const date = parse(datePart, "yyyy-MM-dd", new Date());
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date: ${row.Date}`);
        return;
      }
      const monthKey = format(date, "yyyy-MM");
      workoutCounts[monthKey] = (workoutCounts[monthKey] || 0) + 1;
    } catch (error) {
      console.error(`Error parsing date: ${row.Date}`, error);
    }
  });
  const workoutFrequency: FrequencyData[] = Object.entries(workoutCounts)
    .map(([month, count]) => ({
      month,
      count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Process exercise frequency
  const exerciseCounts: { [key: string]: number } = {};
  parsedData.forEach((row) => {
    exerciseCounts[row["Exercise Name"]] =
      (exerciseCounts[row["Exercise Name"]] || 0) + 1;
  });
  const exerciseFrequency: ExerciseData[] = Object.entries(exerciseCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Count unique workout dates
  const uniqueWorkoutDates = new Set(
    parsedData.map((row) => row.Date.split(" ")[0])
  );
  const totalWorkouts = uniqueWorkoutDates.size;

  const sortedDates = Object.keys(workoutCounts).sort();
  const startDate = sortedDates[1];
  const endDate = sortedDates[sortedDates.length - 1];

  return {
    data: parsedData,
    workoutFrequency,
    exerciseFrequency,
    totalWorkouts,
    startDate,
    endDate,
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
