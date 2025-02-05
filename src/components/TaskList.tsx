import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";

// Define the types for the props
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

interface TaskListProps {
  tasks: Task[];
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  tasksLoading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, filter, setFilter, tasksLoading }) => {
  const router = useRouter();
  const { projectId }  = router.query;
  // Handle task click to navigate to the task detail page
  const handleTaskClick = async (taskId: string) => {    
    await router.push(`/projects/${projectId}/tasks/${taskId}`);
  };


  return (
    <div className="mt-6">
      {/* Task Filter */}
      <div className="mt-6 flex gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant={filter === "TODO" ? "default" : "outline"} onClick={() => setFilter("TODO")}>
          TODO
        </Button>
        <Button variant={filter === "IN_PROGRESS" ? "default" : "outline"} onClick={() => setFilter("IN_PROGRESS")}>
          In Progress
        </Button>
        <Button variant={filter === "DONE" ? "default" : "outline"} onClick={() => setFilter("DONE")}>
          Completed
        </Button>
      </div>

      {/* Task List */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Tasks</h2>
        {tasksLoading ? (
          <Loader2 className="animate-spin w-6 h-6 mx-auto" />
        ) : tasks && tasks.length > 0 ? (
          <div className="space-y-3 mt-3">
            {tasks
              .filter((task) => filter === "all" || task.status === filter)
              .map((task) => (
                <Card
                  key={task.id}
                  className="shadow-md cursor-pointer"
                  onClick={() => handleTaskClick(task.id)} // Navigate to task detail
                >
                  <CardHeader>
                    <h3 className="text-md font-bold">{task.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{task.description}</p>
                    <p
                      className={`mt-2 text-sm ${
                        task.status === "DONE"
                          ? "text-green-500"
                          : task.status === "IN_PROGRESS"
                          ? "text-blue-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-3">No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
