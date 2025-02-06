import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Loader2 } from "lucide-react";


const TaskDetailPage: React.FC = () => {
    const router = useRouter();
    const { taskId } = router.query;

    const { data: task, isLoading, isError } = api.task.getById.useQuery(
        { id: taskId as string },
        {
            enabled: !!taskId,
        }
    );

    if (isLoading) {
        return <Loader2 className="animate-spin w-6 h-6 mx-auto" />;
    }

    if (isError || !task) {
        return <div>Task not found!</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-semibold">{task.title}</h1>
            <p className="mt-2 text-lg">{task.description || "No description provided."}</p>

            <div className="mt-6">
                <h3 className="text-xl font-medium">Details</h3>
                <div className="space-y-2 mt-4">
                    <div>
                        <strong>Priority: </strong>
                        <span>{task.priority}</span>
                    </div>
                    <div>
                        <strong>Status: </strong>
                        <span
                            className={`${task.status === "DONE"
                                    ? "text-green-500"
                                    : task.status === "IN_PROGRESS"
                                        ? "text-blue-500"
                                        : "text-yellow-500"
                                }`}
                        >
                            {task.status}
                        </span>
                    </div>
                    <div>
                        <strong>Deadline: </strong>
                        <span>{task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline set"}</span>
                    </div>
                    <div>
                        <strong>Created At: </strong>
                        <span>{new Date(task.createdAt).toLocaleString()}</span>
                    </div>
                    <div>
                        <strong>Last Updated: </strong>
                        <span>{new Date(task.updatedAt).toLocaleString()}</span>
                    </div>
                    <div>
                        <strong>Project: </strong>
                        <span>{task.project.name}</span>
                    </div>
                    <div>
                        <strong>Created By: </strong>
                        <span>{task.createdBy.name}</span>
                    </div>
                    <div>
                        <strong>Assigned To: </strong>
                        <span>{task.assignedTo ? task.assignedTo.name : "Not assigned"}</span>
                    </div>
                </div>
            </div>

            <button
                className="mt-6 py-2 px-4 bg-blue-500 text-white rounded-lg"
                onClick={() => router.push("/tasks")}
            >
                Back to Tasks
            </button>
        </div>
    );
};

export default TaskDetailPage;
