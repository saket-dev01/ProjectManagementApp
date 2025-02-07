import { useSession } from "next-auth/react";
import { api } from "~/utils/api"; // Assuming api helper is set up for tasks
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Router, { useRouter } from "next/router";

export default function Page() {
    const { data: session } = useSession();
    const router = useRouter();
    // State for pagination
    const [assignedPage, setAssignedPage] = useState(0);
    const [reportedPage, setReportedPage] = useState(0);
    const tasksPerPage = 9; // Number of tasks per page


    const { data: assignedTasks, isLoading: isLoadingAssigned, isError: isErrorAssigned } = api.task.getAssignedToUser.useQuery(
        { userId: session?.user?.id || "", skip: assignedPage * tasksPerPage, take: tasksPerPage },
        { enabled: !!session?.user?.id }
    );

    const { data: reportedTasks, isLoading: isLoadingReported, isError: isErrorReported } = api.task.getReportedByUser.useQuery(
        { userId: session?.user?.id || "", skip: reportedPage * tasksPerPage, take: tasksPerPage },
        { enabled: !!session?.user?.id }
    );

    if (!session) {
        return <div>Please log in to view your tasks.</div>;
    }

    if (isLoadingAssigned || isLoadingReported) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin w-6 h-6" />
            </div>
        );
    }

    if (isErrorAssigned || isErrorReported) {
        return <div>Error loading tasks</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Your Tasks</h1>
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Assigned to You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignedTasks?.length === 0 ? (
                        <p>No tasks assigned to you.</p>
                    ) : (
                        assignedTasks?.map((task) => (
                            <div key={task.id} className="border p-4 rounded-md shadow-sm">
                                <h3 className="text-lg font-semibold">{task.title}</h3>
                                <p><strong>Project:</strong> {task.project?.name}</p>
                                <p><strong>Status:</strong> {task.status}</p>
                                <Button className="mt-2" onClick={async () => { await router.push(`/projects/${task.projectId}/tasks/${task.id}`) }}>
                                    View Task
                                </Button>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex justify-between mt-4">
                    <Button
                        onClick={() => setAssignedPage((prev) => Math.max(prev - 1, 0))}
                        disabled={assignedPage === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() =>
                            setAssignedPage((prev) =>
                                (assignedTasks?.length ?? 0) === tasksPerPage ? prev + 1 : prev
                            )
                        }
                        disabled={(assignedTasks?.length ?? 0) < tasksPerPage}
                    >
                        Next
                    </Button>

                </div>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-4">Reported by You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportedTasks?.length === 0 ? (
                        <p>You have not reported any tasks yet.</p>
                    ) : (
                        reportedTasks?.map((task) => (
                            <div key={task.id} className="border p-4 rounded-md shadow-sm">
                                <h3 className="text-lg font-semibold">{task.title}</h3>
                                <p><strong>Project:</strong> {task.project?.name}</p>
                                <p><strong>Status:</strong> {task.status}</p>
                                <Button className="mt-2" onClick={async () => { await router.push(`/projects/${task.projectId}/tasks/${task.id}`) }}>
                                    View Task
                                </Button>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex justify-between mt-4">
                    <Button
                        onClick={() => setReportedPage((prev) => Math.max(prev - 1, 0))}
                        disabled={reportedPage === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() =>
                            setReportedPage((prev) =>
                                (reportedTasks?.length ?? 0) === tasksPerPage ? prev + 1 : prev
                            )
                        }
                        disabled={(reportedTasks?.length ?? 0) < tasksPerPage}
                    >
                        Next
                    </Button>

                </div>
            </div>
        </div>
    );
}
