import React, { useState } from "react";
import {
  PlusIcon,
  Pencil,
  Trash2,
  Archive,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function App() {
  const [habits, setHabits] = useState([]);
  const [archivedHabits, setArchivedHabits] = useState([]);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  const [name, setName] = useState("");
  const [goal, setGoal] = useState("1 times Daily");
  const [repeat, setRepeat] = useState("Daily");
  const [timeOfDay, setTimeOfDay] = useState("Any Time");
  const [startDate, setStartDate] = useState("Today");
  const [color, setColor] = useState("#3b82f6");

  const resetForm = () => {
    setName("");
    setGoal("1 times Daily");
    setRepeat("Daily");
    setTimeOfDay("Any Time");
    setStartDate("Today");
    setColor("#3b82f6");
  };

  const addHabit = () => {
    const newHabit = {
      id: Date.now(),
      name,
      goal,
      repeat,
      timeOfDay,
      startDate,
      color,
      streak: 0,
      lastCompleted: null,
    };
    setHabits([...habits, newHabit]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const editHabit = () => {
    setHabits(
      habits.map((h) =>
        h.id === editingHabit.id
          ? { ...editingHabit, name, goal, repeat, timeOfDay, startDate, color }
          : h
      )
    );
    setIsEditDialogOpen(false);
    setEditingHabit(null);
    resetForm();
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((h) => h.id !== id));
  };

  const archiveHabit = (habit) => {
    setHabits(habits.filter((h) => h.id !== habit.id));
    setArchivedHabits([...archivedHabits, habit]);
  };

  const unarchiveHabit = (habit) => {
    setArchivedHabits(archivedHabits.filter((h) => h.id !== habit.id));
    setHabits([...habits, habit]);
  };

  const completeHabit = (habit) => {
    const today = new Date().toDateString();
    const updatedHabit = {
      ...habit,
      streak: habit.lastCompleted === today ? habit.streak : habit.streak + 1,
      lastCompleted: today,
    };
    setHabits(habits.map((h) => (h.id === habit.id ? updatedHabit : h)));
  };

  const HabitForm = ({ onSubmit, isEdit }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <Input
        placeholder="Habit Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Select value={goal} onValueChange={setGoal}>
        <SelectTrigger>
          <SelectValue placeholder="Goal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1 times Daily">1 time Daily</SelectItem>
          <SelectItem value="2 times Daily">2 times Daily</SelectItem>
          <SelectItem value="3 times Daily">3 times Daily</SelectItem>
        </SelectContent>
      </Select>
      <Select value={repeat} onValueChange={setRepeat}>
        <SelectTrigger>
          <SelectValue placeholder="Repeat" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Daily">Daily</SelectItem>
          <SelectItem value="Weekly">Weekly</SelectItem>
          <SelectItem value="Monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>
      <Select value={timeOfDay} onValueChange={setTimeOfDay}>
        <SelectTrigger>
          <SelectValue placeholder="Time of Day" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Any Time">Any Time</SelectItem>
          <SelectItem value="Morning">Morning</SelectItem>
          <SelectItem value="Afternoon">Afternoon</SelectItem>
          <SelectItem value="Evening">Evening</SelectItem>
        </SelectContent>
      </Select>
      <Select value={startDate} onValueChange={setStartDate}>
        <SelectTrigger>
          <SelectValue placeholder="Start Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Today">Today</SelectItem>
          <SelectItem value="Tomorrow">Tomorrow</SelectItem>
          <SelectItem value="Next Week">Next Week</SelectItem>
        </SelectContent>
      </Select>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10 p-1 rounded-md"
        />
      </div>
      <Button type="submit">{isEdit ? "Update Habit" : "Save Habit"}</Button>
    </form>
  );

  const HabitCard = ({ habit, isArchived }) => (
    <Card className="mb-4" style={{ borderLeft: `4px solid ${habit.color}` }}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {habit.name}
          <Badge variant="secondary">{habit.repeat}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Goal: {habit.goal}</p>
        <p>Time of Day: {habit.timeOfDay}</p>
        <p>Start Date: {habit.startDate}</p>
        <div className="mt-2">
          <p className="text-sm font-medium">Streak: {habit.streak} days</p>
          <Progress value={habit.streak} max={30} className="mt-1" />
        </div>
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        {!isArchived && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() => completeHabit(habit)}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setEditingHabit(habit);
                setName(habit.name);
                setGoal(habit.goal);
                setRepeat(habit.repeat);
                setTimeOfDay(habit.timeOfDay);
                setStartDate(habit.startDate);
                setColor(habit.color);
                setIsEditDialogOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => deleteHabit(habit.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => archiveHabit(habit)}
            >
              <Archive className="h-4 w-4" />
            </Button>
          </>
        )}
        {isArchived && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => unarchiveHabit(habit)}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Habit Tracker</h1>
      <Alert className="mb-6">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          Stay consistent with your habits to build longer streaks!
        </AlertDescription>
      </Alert>
      <div className="mb-6 flex justify-between items-center">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
            </DialogHeader>
            <HabitForm onSubmit={addHabit} isEdit={false} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Habits</TabsTrigger>
          <TabsTrigger value="archived">Archived Habits</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {habits.length === 0 ? (
            <p className="text-center text-gray-500">
              No active habits yet. Start by adding a new habit!
            </p>
          ) : (
            habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} isArchived={false} />
            ))
          )}
        </TabsContent>
        <TabsContent value="archived">
          {archivedHabits.length === 0 ? (
            <p className="text-center text-gray-500">No archived habits.</p>
          ) : (
            archivedHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} isArchived={true} />
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
          </DialogHeader>
          <HabitForm onSubmit={editHabit} isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
