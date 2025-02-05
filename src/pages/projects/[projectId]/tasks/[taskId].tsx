import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
      {/* Task Title */}
      <h2 className="text-2xl font-bold">{task.title}</h2>
      <p className="text-gray-600">{task.description || "No description available"}</p>

      {/* Task Metadata */}
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

      {/* Project Information */}
      {/* {task.project && (
        <Card className="w-full mt-4">
          <CardHeader>
            <h3 className="text-lg font-semibold">Project: {task.project.name}</h3>
          </CardHeader>
          <CardContent>
            <p>{task.project.description || "No project description available"}</p>
          </CardContent>
        </Card>
      )} */}

      {/* Tags */}
      {/* {task.tags?.length > 0 && (
        <Card className="w-full mt-4">
          <CardHeader>
            <h3 className="text-lg font-semibold">Tags</h3>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <li key={tag.id} className="bg-blue-200 text-blue-600 px-3 py-1 rounded-lg text-sm">
                  {tag.tag.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )} */}

      {/* Comments */}
      {/* {task.comments?.length > 0 && (
        <Card className="w-full mt-4">
          <CardHeader>
            <h3 className="text-lg font-semibold">Comments</h3>
          </CardHeader>
          <CardContent>
            <ul>
              {task.comments.map((comment) => (
                <li key={comment.id} className="mb-4 border-b pb-2">
                  <p className="font-semibold">{comment.createdBy?.name}</p>
                  <p>{comment.comment}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )} */}

      {/* Back Button */}
      <Button className="mt-6" onClick={() => router.push(`/projects/${task.projectId}`)}>
        Back to Project
      </Button>
    </div>
  );
}
