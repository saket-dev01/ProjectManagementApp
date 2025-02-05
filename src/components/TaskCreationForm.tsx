import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { api } from "~/utils/api";

interface TaskCreationFormProps {
  onClose: () => void;
}

export function TaskCreationForm({ onClose }: TaskCreationFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [assignee, setAssignee] = useState<string | undefined>();
  const [project, setProject] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch users and projects dynamically
  const { data: users, isLoading: usersLoading } = api.user.getAll.useQuery();
  const { data: projects, isLoading: projectsLoading } = api.project.getAll.useQuery();

  // TRPC Mutation for task creation
  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      setSuccessMessage("Task created successfully!");
      onClose();
    },
    onError: (error) => {
      setErrorMessage(`Failed to create task: ${error.message}`);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Task title is required.");
      return;
    }

    if (!project) {
      setErrorMessage("Please select a project.");
      return;
    }

    // Reset previous messages before creating the task
    setErrorMessage(null);
    setSuccessMessage(null);

    createTask.mutate({
      title,
      description,
      priority,
      status: "TODO",
      deadline: date || undefined,
      assignedToId: assignee || undefined,
      projectId: project, // Set the selected project ID
      tags: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-4 text-sm text-red-600 bg-red-100 rounded">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="p-4 text-sm text-green-600 bg-green-100 rounded">
          {successMessage}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Deadline</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select onValueChange={(value) => setPriority(value as "LOW" | "MEDIUM" | "HIGH")}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Assign To</Label>
        <Select onValueChange={setAssignee} disabled={usersLoading}>
          <SelectTrigger>
            <SelectValue placeholder={usersLoading ? "Loading users..." : "Select team member"} />
          </SelectTrigger>
          <SelectContent>
            {users?.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name || "Unknown User"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project">Select Project</Label>
        <Select onValueChange={setProject} disabled={projectsLoading}>
          <SelectTrigger>
            <SelectValue placeholder={projectsLoading ? "Loading projects..." : "Select project"} />
          </SelectTrigger>
          <SelectContent>
            {projects?.map((proj) => (
              <SelectItem key={proj.id} value={proj.id}>
                {proj.name || "Unnamed Project"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={createTask.status === "pending"}>
          {createTask.status === "pending" ? "Creating..." : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
