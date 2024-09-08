import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart2Icon, CalendarIcon, PieChartIcon } from "lucide-react";
import { ExerciseData } from "@/types/types";

interface SummaryTabProps {
  totalWorkouts: number;
  startDate: string | null;
  endDate: string | null;
  exerciseFrequency: ExerciseData[];
}

const SummaryTab: React.FC<SummaryTabProps> = ({
  totalWorkouts,
  startDate,
  endDate,
  exerciseFrequency,
}) => {
  return (
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
              <div className="text-2xl font-bold">{totalWorkouts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Date Range</CardTitle>
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
  );
};

export default SummaryTab;
