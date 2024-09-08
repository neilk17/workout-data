"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkoutData, FrequencyData, ExerciseData } from "@/types/types";
import SummaryTab from "@/components/Summary";
import FrequencyTab from "@/components/Frequency";
import { processCSV } from "@/lib/utils";
import ExercisesTab from "@/components/Exercise";

export default function WorkoutAnalysis() {
  const [data, setData] = useState<WorkoutData[]>([]);
  const [workoutFrequency, setWorkoutFrequency] = useState<FrequencyData[]>([]);
  const [exerciseFrequency, setExerciseFrequency] = useState<ExerciseData[]>(
    []
  );
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [totalWorkouts, setTotalWorkouts] = useState<number>(0);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            const result = processCSV(e.target.result as string);
            setData(result.data);
            setWorkoutFrequency(result.workoutFrequency);
            setExerciseFrequency(result.exerciseFrequency);
            setTotalWorkouts(result.totalWorkouts);
            setStartDate(result.startDate);
            setEndDate(result.endDate);
          }
        };
        reader.readAsText(file);
      }
    },
    []
  );

  return (
    <div className="container max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Workout Analysis Dashboard</h1>

      <div className="mb-6">
        <Label htmlFor="file" className="text-lg font-semibold mb-2 block">
          Upload Workout Data
        </Label>
        <Input
          id="file"
          type="file"
          onChange={handleFileUpload}
          className="max-w-sm"
        />
      </div>

      {data.length > 0 && (
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="frequency">Workout Frequency</TabsTrigger>
            <TabsTrigger value="exercises">Top Exercises</TabsTrigger>
          </TabsList>
          <TabsContent value="summary">
            <SummaryTab
              totalWorkouts={totalWorkouts}
              startDate={startDate}
              endDate={endDate}
              exerciseFrequency={exerciseFrequency}
            />
          </TabsContent>
          <TabsContent value="frequency">
            <FrequencyTab workoutFrequency={workoutFrequency} />
          </TabsContent>
          <TabsContent value="exercises">
            <ExercisesTab exerciseFrequency={exerciseFrequency} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
