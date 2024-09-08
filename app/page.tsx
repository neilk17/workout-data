// app/page.tsx
"use client";

import { useState, useCallback } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart2Icon, CalendarIcon, PieChartIcon } from "lucide-react";
import { format, parse } from "date-fns";

interface WorkoutData {
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

interface FrequencyData {
  month: string;
  count: number;
}

interface ExerciseData {
  name: string;
  count: number;
}

export default function WorkoutAnalysis() {
  const [data, setData] = useState<WorkoutData[]>([]);
  const [workoutFrequency, setWorkoutFrequency] = useState<FrequencyData[]>([]);
  const [exerciseFrequency, setExerciseFrequency] = useState<ExerciseData[]>(
    []
  );
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const processCSV = useCallback((csvText: string) => {
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

    setData(parsedData);

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
    const frequencyData: FrequencyData[] = Object.entries(workoutCounts)
      .map(([month, count]) => ({
        month,
        count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    setWorkoutFrequency(frequencyData);

    // Process exercise frequency
    const exerciseCounts: { [key: string]: number } = {};
    parsedData.forEach((row) => {
      exerciseCounts[row["Exercise Name"]] =
        (exerciseCounts[row["Exercise Name"]] || 0) + 1;
    });
    const exerciseData: ExerciseData[] = Object.entries(exerciseCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    setExerciseFrequency(exerciseData);

    const sortedDates = Object.keys(workoutCounts).sort();
    console.log(sortedDates);
    setStartDate(sortedDates[1]);
    setEndDate(sortedDates[sortedDates.length - 1]);
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            processCSV(e.target.result as string);
          }
        };
        reader.readAsText(file);
      }
    },
    [processCSV]
  );

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC0CB",
    "#A52A2A",
    "#DDA0DD",
    "#20B2AA",
  ];

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
            <Card>
              <CardHeader>
                <CardTitle>Workout Summary</CardTitle>
                <CardDescription>Overview of your workout data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Workouts
                      </CardTitle>
                      <BarChart2Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {workoutFrequency.length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Date Range
                      </CardTitle>
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <span className="text-2xl font-bold">
                        {startDate} to {endDate}
                      </span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Most Frequent Exercise
                      </CardTitle>
                      <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {exerciseFrequency[0]?.name}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {exerciseFrequency[0]?.count} times
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="frequency">
            <Card>
              <CardHeader>
                <CardTitle>Workout Frequency</CardTitle>
                <CardDescription>Number of workouts per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={workoutFrequency}>
                    <XAxis
                      dataKey="month"
                      tickFormatter={(value) =>
                        format(parse(value, "yyyy-MM", new Date()), "MMM yyyy")
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) =>
                        format(parse(value, "yyyy-MM", new Date()), "MMMM yyyy")
                      }
                    />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="exercises">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Exercises</CardTitle>
                <CardDescription>
                  Most frequently performed exercises
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={exerciseFrequency.slice(0, 10)}
                    layout="vertical"
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={exerciseFrequency.slice(0, 10)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {exerciseFrequency.slice(0, 10).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
