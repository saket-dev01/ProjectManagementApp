import TaskCard from "@/components/TaskCard";
import { api } from "~/utils/api";

export default function TasksPage() {
    const tasks = api.task.getAll.useQuery().data;

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tasks</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks ? tasks.map(task => (
                    <TaskCard 
                        key={task.id}
                        title={task.title}
                        description={task.description || ""}
                        status={task.status as "Pending" | "In Progress" | "Completed"}
                        dueDate={task.deadline}
                        onEdit={() => console.log(`Edit task ${task.id}`)}
                        onDelete={() => console.log(`Delete task ${task.id}`)}
                    />
                )) : ""}
            </div>
        </div>
    );
}
