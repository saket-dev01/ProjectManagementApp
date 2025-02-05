
// TaskSummaryCard.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ListTodo, CheckCircle, Clock } from "lucide-react";

interface TaskSummaryCardProps {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

const TaskSummaryCard: React.FC<TaskSummaryCardProps> = ({ totalTasks, completedTasks, pendingTasks }) => {
  return (
    <div className="mt-6 grid grid-cols-3 gap-4">
      {/* Total Tasks Card */}
      <Card className="bg-blue-50 p-4">
        <CardHeader className="flex items-center gap-2 text-blue-600">
          <ListTodo className="w-5 h-5" /> Total Tasks
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </CardContent>
      </Card>

      {/* Completed Tasks Card */}
      <Card className="bg-green-50 p-4">
        <CardHeader className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" /> Completed
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{completedTasks}</p>
        </CardContent>
      </Card>

      {/* Pending Tasks Card */}
      <Card className="bg-yellow-50 p-4">
        <CardHeader className="flex items-center gap-2 text-yellow-600">
          <Clock className="w-5 h-5" /> Pending
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{pendingTasks}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskSummaryCard;
