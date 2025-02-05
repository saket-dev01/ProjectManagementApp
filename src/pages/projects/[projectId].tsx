import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Users, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import ProjectMembers from "~/components/ProjectMembers";
import CreateTaskForm from "~/components/CreateTaskForm";
import TaskList from "~/components/TaskList";
import TaskSummaryCard from "~/components/TaskSummaryCard";

export default function ProjectPage() {
  const session = useSession();
  const router = useRouter();
  const { projectId } = router.query;

  
  // Fetch project details
  const { data: project, isLoading: projectLoading, refetch: refetchProjects } = api.project.getById.useQuery({ id: projectId as string });

  // Fetch tasks for this project
  const { data: tasks, isLoading: tasksLoading, refetch: refetchTasks } = api.task.getByProjectId.useQuery({ projectId: projectId as string });

  // State for task creation
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [filter, setFilter] = useState("all"); // "all", "TODO", "IN_PROGRESS", "DONE"

  // State for adding member
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  if (!session) {
    return <div>Please log in to view your Project.</div>;
  }


  // API call to create task
  const createTaskMutation = api.task.create.useMutation({
    onSuccess: () => {
      void refetchTasks();
      setTaskTitle("");
      setTaskDescription("");
    }
  });

  const addMemberMutation = api.project.addMember.useMutation({
    onSuccess: () => {
      setIsDialogOpen(false); // ✅ Close dialog on success
      setMemberEmail(""); // ✅ Clear input field
      void refetchProjects(); // ✅ Refetch project data to update members list
    }
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    await createTaskMutation.mutateAsync({
      projectId: projectId as string,
      title: taskTitle,
      description: taskDescription,
      priority: "MEDIUM", // Default priority
      status: "TODO" // Default status
    });
  };

  const handleAddMember = async () => {
    if (!memberEmail.trim()) return;

    await addMemberMutation.mutateAsync({
      projectId: projectId as string,
      email: memberEmail
    });
  };

  if (projectLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }
  
  if (!project) return <p className="text-red-500">Project not found!</p>;

  // Task Statistics
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === "DONE").length || 0;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Project Details */}
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <p className="text-gray-600">{project.description}</p>

      {/* Project Members */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" /> Project Members
        </h2>
        <ProjectMembers members={project.members} />
        <Button className="mt-2 flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
          <UserPlus className="w-5 h-5" /> Add Member
        </Button>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <h2 className="text-lg font-semibold mb-2">Add Member</h2>
          <Input
            type="email"
            placeholder="Enter member's email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            required
          />
          <Button onClick={handleAddMember} className="mt-2 w-full" disabled={addMemberMutation.isPending}>
            {addMemberMutation.isPending ? "Adding..." : "Add Member"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Task Summary Card */}
      <TaskSummaryCard
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        pendingTasks={pendingTasks}
      />

      {/* Create Task Form */}
      <CreateTaskForm
        refetch={refetchTasks}
        projectId={project.id}
      />

      {/* Task List */}
      <TaskList
        tasks={tasks || []}
        filter={filter}
        setFilter={setFilter}
        tasksLoading={tasksLoading}
      />
    </div>
  );
}
