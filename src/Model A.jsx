import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

function App() {
  const [habits, setHabits] = useState([]);
  const [open, setOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    frequency: "daily",
    goal: 1,
    time: "morning",
    startDate: new Date().toISOString().split("T")[0],
    color: "#4a90e2",
  });

  useEffect(() => {
    const storedHabits = localStorage.getItem("habits");
    if (storedHabits) setHabits(JSON.parse(storedHabits));
  }, []);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    setHabits([
      ...habits,
      {
        ...newHabit,
        id: Date.now(),
        streak: 0,
        lastCompleted: null,
        archived: false,
      },
    ]);
    setOpen(false);
  };

  const updateHabit = (id, field, value) => {
    setHabits(habits.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
  };

  const toggleComplete = (id) => {
    setHabits(
      habits.map((h) =>
        h.id === id
          ? {
              ...h,
              streak:
                h.lastCompleted === new Date().toDateString()
                  ? h.streak
                  : h.streak + 1,
              lastCompleted: new Date().toDateString(),
            }
          : h
      )
    );
  };

  const archiveHabit = (id) => updateHabit(id, "archived", true);
  const unarchiveHabit = (id) => updateHabit(id, "archived", false);

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Button onClick={() => setOpen(true)} className="mb-4">
            Add Habit
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {habits
              .filter((h) => !h.archived)
              .map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={toggleComplete}
                  onArchive={archiveHabit}
                  onEdit={updateHabit}
                />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="archived">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {habits
              .filter((h) => h.archived)
              .map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onUnarchive={unarchiveHabit}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
      <HabitDialog
        open={open}
        setOpen={setOpen}
        habit={newHabit}
        setHabit={setNewHabit}
        onSave={addHabit}
      />
    </div>
  );
}

function HabitCard({ habit, onComplete, onArchive, onEdit, onUnarchive }) {
  const progress = habit.goal ? (habit.streak / habit.goal) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ color: habit.color }}>{habit.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>Frequency: {habit.frequency}</div>
        <div>Goal: {habit.goal} times/day</div>
        <div>Streak: {habit.streak}</div>
        <Slider defaultValue={[progress]} className="mt-4" />
      </CardContent>
      <CardFooter className="flex justify-between">
        {!habit.archived ? (
          <>
            <Button onClick={() => onComplete(habit.id)}>Complete</Button>
            <Button onClick={() => onArchive(habit.id)}>Archive</Button>
          </>
        ) : (
          <Button onClick={() => onUnarchive(habit.id)}>Unarchive</Button>
        )}
      </CardFooter>
    </Card>
  );
}

function HabitDialog({ open, setOpen, habit, setHabit, onSave }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={habit.name}
              onChange={(e) => setHabit({ ...habit, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency">Frequency</Label>
            <select
              id="frequency"
              value={habit.frequency}
              onChange={(e) =>
                setHabit({ ...habit, frequency: e.target.value })
              }
              className="p-2 border rounded"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          {/* Add more inputs for goal, time, start date, color here */}
        </div>
        <DialogFooter>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default App;