import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "~/utils/api";
import { TaskStatus, Priority } from "@prisma/client"; // Import enums from Prisma
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface CreateTaskFormProps {
    refetch: () => void;
    projectId: string; // Add projectId to the props
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ refetch, projectId }) => {
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.TODO); // Type as TaskStatus enum
    const [taskPriority, setTaskPriority] = useState<Priority>(Priority.MEDIUM); // Type as Priority enum
    const [assignedToId, setAssignedToId] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
    const [projectMembers, setProjectMembers] = useState<{ id: string, name: string | null }[] | undefined>([]); // State to hold members

    // Fetch project members using the projectId prop
    const { data: members, isLoading: membersLoading } = api.project.getMembers.useQuery({ projectId });

    // Update projectMembers when members data is fetched
    useEffect(() => {
        if (members) {
            setProjectMembers(members);
        }
    }, [members]);

    const createTaskMutation = api.task.create.useMutation({
        onSuccess: () => {
            refetch();
            setTaskTitle("");
            setTaskDescription("");
            setTaskStatus(TaskStatus.TODO);
            setTaskPriority(Priority.MEDIUM);
            setAssignedToId("");
            setStartDate(new Date());
            setDueDate(new Date());
        },
        onError: (error) => {
            console.error("Error creating task:", error);
        }
    });

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!taskTitle.trim()) return;

        try {
            await createTaskMutation.mutateAsync({
                title: taskTitle,
                description: taskDescription,
                status: taskStatus,
                priority: taskPriority,
                assignedToId,
                deadline: dueDate,
                projectId
            });
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    };

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
                <div>
                    <Label>Status</Label>
                    <Select value={taskStatus} onValueChange={(value) => setTaskStatus(value as TaskStatus)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TaskStatus.TODO}>{TaskStatus.TODO}</SelectItem>
                            <SelectItem value={TaskStatus.IN_PROGRESS}>{TaskStatus.IN_PROGRESS}</SelectItem>
                            <SelectItem value={TaskStatus.DONE}>{TaskStatus.DONE}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Priority</Label>
                    <Select value={taskPriority} onValueChange={(value) => setTaskPriority(value as Priority)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={Priority.LOW}>{Priority.LOW}</SelectItem>
                            <SelectItem value={Priority.MEDIUM}>{Priority.MEDIUM}</SelectItem>
                            <SelectItem value={Priority.HIGH}>{Priority.HIGH}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Assigned To</Label>
                    <Select value={assignedToId} onValueChange={(value) => setAssignedToId(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Member" />
                        </SelectTrigger>
                        <SelectContent>
                            {membersLoading ? (
                                <SelectItem value="NaN" disabled>Loading...</SelectItem>
                            ) : projectMembers && projectMembers.length > 0 ? (
                                projectMembers.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        {member.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="NaN" disabled>No members available</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-4">
                    {/* Start Date */}
                    <div className="flex flex-col w-full">
                        <Label>Start Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className="w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <DatePicker
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Due Date */}
                    <div className="flex flex-col w-full">
                        <Label>Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className="w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <DatePicker
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={setDueDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>


                <Button type="submit" disabled={createTaskMutation.isPending}>
                    {createTaskMutation.isPending ? "Creating..." : "Add Task"}
                </Button>
            </form>
        </div>
    );
};

export default CreateTaskForm;
