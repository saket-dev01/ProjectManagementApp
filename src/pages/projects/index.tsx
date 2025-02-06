import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

export default function ProjectsPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [newProjectDescription, setNewProjectDescription] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    if (!session) {
        return <div>Please log in to view your Projects.</div>;
    }

    const { data: projects, isLoading, refetch } = api.project.getAll.useQuery();

    const createProject = api.project.create.useMutation({
        onSuccess: () => {
            void refetch();
            setOpen(false);
            setNewProjectName("");
            setNewProjectDescription("");
        },
    });

    const addMember = api.project.addMember.useMutation({
        onSuccess: () => {
            void refetch();
            setMemberEmail("");
        },
    });


    const handleCreateProject = async () => {
        if (!newProjectName.trim()) {
            return;
        }
        try {
            await createProject.mutateAsync({
                name: newProjectName,
                description: newProjectDescription,
            });
            await refetch();
            setNewProjectName("");
            setNewProjectDescription("");
        } catch (error) {
            console.error("Failed to create project", error);
        }
    };

    const handleAddMember = async () => {
        if (!selectedProjectId || !memberEmail.trim()) {
            return;
        }
        try {
            await addMember.mutateAsync({
                projectId: selectedProjectId,
                email: memberEmail,
            });
            await refetch();
            setMemberEmail("");
        } catch (error) {
            console.error("Failed to add member", error);
        }
    };

    if (isLoading) return <p className="text-gray-500">Loading...</p>;
    if (!projects || projects.length === 0) return <p className="text-gray-500">No projects found.</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Projects</h1>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="mb-4">+ Add Project</Button>
                </DialogTrigger>
                <DialogContent>
                    <h2 className="text-lg font-semibold mb-2">Create New Project</h2>
                    <Input
                        placeholder="Project Name"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                    />
                    <Input
                        placeholder="Description (optional)"
                        value={newProjectDescription}
                        onChange={(e) => setNewProjectDescription(e.target.value)}
                    />
                    <Button onClick={handleCreateProject} className="mt-2 w-full">
                        {createProject.isPending ? "Creating..." : "Create"}
                    </Button>
                </DialogContent>
            </Dialog>

            <ul className="space-y-3">
                {projects.map((project) => (
                    <li
                        key={project.id}
                        className="p-4 border rounded-md shadow cursor-pointer hover:bg-gray-100"
                        onClick={() => router.push(`/projects/${project.id}`)}
                    >
                        <h2 className="text-lg font-semibold">{project.name}</h2>
                        <p className="text-gray-600">{project.description || "No description available"}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
