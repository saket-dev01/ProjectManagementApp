import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

export default function TaskDetails() {
  const session = useSession();
  const router = useRouter();
  const { taskId } = router.query;

  if (!session) {
    return <div>Please log in to view your Task.</div>;
  }

  const { data: task, isLoading, isError, error } = api.task.getById.useQuery(
    { id: taskId as string }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center">
        <p>Error loading task details: {error.message}</p>
      </div>
    );
  }

  if (!task) {
    return <div className="text-center">No task found</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto shadow-md mt-4">
      <h2 className="text-2xl font-bold">{task.title}</h2>
      <p className="text-gray-600">{task.description || "No description available"}</p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <Label>Created By</Label>
          <p>{task.createdBy?.name || "Unknown"}</p>
        </div>
        <div>
          <Label>Assigned To</Label>
          <p>{task.assignedTo?.name || "Not assigned"}</p>
        </div>
        <div>
          <Label>Status</Label>
          <p className="capitalize">{task.status.toLowerCase()}</p>
        </div>
        <div>
          <Label>Priority</Label>
          <p className="capitalize">{task.priority.toLowerCase()}</p>
        </div>
        <div>
          <Label>Start Date</Label>
          <p>{task.createdAt ? format(new Date(task.createdAt), "PPP") : "Not set"}</p>
        </div>
        <div>
          <Label>Due Date</Label>
          <p>{task.deadline ? format(new Date(task.deadline), "PPP") : "Not set"}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button onClick={() => router.push(`/projects/${task.projectId}/tasks/${task.id}/edit`)}>
          Edit Task
        </Button>

        <Button variant="secondary" onClick={() => router.push(`/projects/${task.projectId}`)}>
          Back to Project
        </Button>
      </div>
    </div>
  );
}
