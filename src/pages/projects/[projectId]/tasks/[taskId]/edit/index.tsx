import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { TaskStatus, Priority } from "@prisma/client";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function EditTaskPage() {
    const router = useRouter();
    const { taskId, projectId } = router.query;

    const { data: task, isLoading, isError } = api.task.getById.useQuery(
        { id: taskId as string },
        { enabled: !!taskId }
    );

    const updateTaskMutation = api.task.update.useMutation({
        onSuccess: () => {
            void router.push(`/projects/${projectId}/tasks/${taskId}`);
        },
        onError: () => {
            void router.push(`/projects/${projectId}/tasks/${taskId}`);
        },
    });

    const deleteTaskMutation = api.task.delete.useMutation({
        onSuccess: () => {
            void router.push(`/projects/${projectId}/tasks`);
        },
        onError: (error) => {
            //alert(`Failed to delete task: ${error.message}`);
        },
    });

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: TaskStatus.TODO as string,
        priority: Priority.MEDIUM as string,
        deadline: new Date(),
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || "",
                description: task.description || "",
                status: task.status as string,
                priority: task.priority as string,
                deadline: task.deadline ? new Date(task.deadline) : new Date(),
            });
        }
    }, [task]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setFormData((prev) => ({ ...prev, deadline: date }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskId || typeof taskId !== "string") return;

        updateTaskMutation.mutate({
            id: taskId,
            title: formData.title,
            description: formData.description,
            status: formData.status as TaskStatus, // Explicit cast to Prisma enum
            priority: formData.priority as Priority, // Explicit cast to Prisma enum
            deadline: formData.deadline ? new Date(formData.deadline) : undefined,
        });
    };

    const handleDelete = () => {
        if (!taskId || typeof taskId !== "string") return;
        deleteTaskMutation.mutate({ id: taskId });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin w-6 h-6" />
            </div>
        );
    }

    if (isError || !task) {
        return <div className="text-red-500 text-center">Error loading task details.</div>;
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Task</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label>Title</Label>
                    <Input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div>
                    <Label>Description</Label>
                    <Textarea name="description" value={formData.description} onChange={handleChange} required />
                </div>

                <div>
                    <Label>Status</Label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                        required
                    >
                        {Object.values(TaskStatus).map((status) => (
                            <option key={status} value={status}>
                                {status.replace("_", " ")}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <Label>Priority</Label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                        required
                    >
                        {Object.values(Priority).map((priority) => (
                            <option key={priority} value={priority}>
                                {priority.charAt(0) + priority.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <Label>Deadline</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                {formData.deadline ? format(formData.deadline, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={formData.deadline} onSelect={handleDateChange} />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex justify-between gap-4">
                    <div className="flex gap-4">
                        <Button type="submit" disabled={updateTaskMutation.isPending}>
                            {updateTaskMutation.isPending ? "Updating..." : "Update Task"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => router.back()}>
                            Cancel
                        </Button>
                    </div>

                    <div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Delete Task
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <p>This action cannot be undone. This will permanently delete the task.</p>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} disabled={deleteTaskMutation.isPending}>
                                        {deleteTaskMutation.isPending ? "Deleting..." : "Confirm"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

            </form>
        </div>
    );
}
