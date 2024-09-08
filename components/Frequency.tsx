import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parse } from "date-fns";
import { FrequencyData } from "@/types/types";

interface FrequencyTabProps {
  workoutFrequency: FrequencyData[];
}

const FrequencyTab: React.FC<FrequencyTabProps> = ({ workoutFrequency }) => {
  return (
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
  );
};

export default FrequencyTab;
