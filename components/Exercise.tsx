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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ExerciseData } from "@/types/types";

interface ExercisesTabProps {
  exerciseFrequency: ExerciseData[];
}

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

const ExercisesTab: React.FC<ExercisesTabProps> = ({ exerciseFrequency }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Exercises</CardTitle>
        <CardDescription>Most frequently performed exercises</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={exerciseFrequency.slice(0, 10)} layout="vertical">
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
  );
};

export default ExercisesTab;
