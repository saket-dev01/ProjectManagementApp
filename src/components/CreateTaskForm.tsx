import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Define the type for props to be passed to the component
interface CreateTaskFormProps {
  taskTitle: string;
  taskDescription: string;
  setTaskTitle: React.Dispatch<React.SetStateAction<string>>;
  setTaskDescription: React.Dispatch<React.SetStateAction<string>>;
  handleCreateTask: (e: React.FormEvent) => void;
  isCreating: boolean; // To control loading state for the button
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  taskTitle,
  taskDescription,
  setTaskTitle,
  setTaskDescription,
  handleCreateTask,
  isCreating
}) => {
  return (
    <div className="mt-6 border p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold">Create a Task</h2>
      <form onSubmit={handleCreateTask} className="space-y-3 mt-3">
        <div>
          <Label>Task Title</Label>
          <Input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Add Task"}
        </Button>
      </form>
    </div>
  );
};

export default CreateTaskForm;
