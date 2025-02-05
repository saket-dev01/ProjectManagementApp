import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import clsx from "clsx"; 

interface TaskCardProps {
    title: string;
    description: string;
    status: "Pending" | "In Progress" | "Completed";
    dueDate?: Date | null;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function TaskCard({ title, description, status, dueDate, onEdit, onDelete }: TaskCardProps) {
    return (
        <Card className="w-full max-w-md p-4 shadow-md rounded-lg border border-gray-200">
            <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <Badge
                    className={clsx(
                        "text-white px-2 py-1 rounded-md",
                        status === "Completed" && "bg-green-500",
                        status === "In Progress" && "bg-yellow-500",
                        status === "Pending" && "bg-gray-400"
                    )}
                >
                    {status}
                </Badge>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 text-sm">{description}</p>
                {dueDate && <p className="text-xs text-gray-500 mt-2">Due: {dueDate.toDateString()}</p>}
                <div className="flex justify-end space-x-2 mt-4">
                    {onEdit && <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>}
                    {onDelete && <Button variant="destructive" size="sm" onClick={onDelete}>Delete</Button>}
                </div>
            </CardContent>
        </Card>
    );
}


