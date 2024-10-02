// App.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function App() {
  const [habits, setHabits] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    frequency: "daily",
    goal: 1,
    timeOfDay: "morning",
    startDate: new Date().toISOString().split("T")[0],
    color: "#0070f3",
  });

  const handleAddHabit = (event) => {
    event.preventDefault();
    setHabits([
      ...habits,
      { ...formData, id: Date.now(), streak: 0, completed: false },
    ]);
    setOpen(false);
    setFormData({
      name: "",
      frequency: "daily",
      goal: 1,
      timeOfDay: "morning",
      startDate: new Date().toISOString().split("T")[0],
      color: "#0070f3",
    });
  };

  const handleComplete = (id) => {
    setHabits(
      habits.map((h) =>
        h.id === id
          ? {
              ...h,
              completed: true,
              streak: h.completed ? h.streak : h.streak + 1,
            }
          : h
      )
    );
  };

  const handleArchive = (id) => {
    setHabits(habits.map((h) => (h.id === id ? { ...h, archived: true } : h)));
  };

  const activeHabits = habits.filter((h) => !h.archived);
  const archivedHabits = habits.filter((h) => h.archived);

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={handleComplete}
                onArchive={handleArchive}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="archived">
          <div className="grid grid-cols-1 gap-4">
            {archivedHabits.map((habit) => (
              <p key={habit.id}>{habit.name}</p>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add Habit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>Add New Habit</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddHabit} className="space-y-4">
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Habit Name"
            />
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, frequency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Slider
              defaultValue={[formData.goal]}
              max={10}
              onValueChange={(value) =>
                setFormData({ ...formData, goal: value[0] })
              }
            />
            {/* Additional fields like timeOfDay, startDate, and color would go here */}
            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HabitCard({ habit, onComplete, onArchive }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ color: habit.color }}>{habit.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Frequency: {habit.frequency}</p>
        <p>Streak: {habit.streak}</p>
        <progress
          className="progress progress-primary w-full"
          value={habit.completed ? 100 : 0}
          max="100"
        ></progress>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onComplete(habit.id)}>Complete</Button>
        <Button onClick={() => onArchive(habit.id)} variant="destructive">
          Archive
        </Button>
      </CardFooter>
    </Card>
  );
}