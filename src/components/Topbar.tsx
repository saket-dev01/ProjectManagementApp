import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router"; // ✅ Change to useRouter (not usePathname)
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogIn, LogOut, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";
import { Button } from "@/components/ui/button";

export default function TopBar() {
    const session = useSession();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [projectId, setProjectId] = useState<string | null | undefined>(null); // ✅ Track projectId separately

    // ✅ Extract project ID only after router is ready
    useEffect(() => {
        if (router.isReady) {
            const id = router.pathname.startsWith("/projects/") ? router.asPath.split("/projects/")[1] : null;
            setProjectId(id);
        }
    }, [router.isReady, router.pathname, router.asPath]);

    // Fetch projects for search dropdown
    const { data: projects } = api.project.getAll.useQuery();

    // Fetch the project name dynamically (only when projectId exists)
    const { data: project } = api.project.getById.useQuery(
        { id: projectId! }, 
        { enabled: !!projectId } // Fetch only if projectId exists
    );

    const handleSignIn = async () => {
        await signIn(undefined, { callbackUrl: '/' });
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
    };

    const handleProjectSelect = (projectId: string) => {
        router.push(`/projects/${projectId}`);
        setOpen(false);
    };

    return (
        <header className="w-full bg-muted shadow-md">
            {/* Navigation Bar */}
            <div className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-300">
                <nav className="flex items-center gap-4">
                    <button onClick={() => router.push('/')} className="text-sm font-medium hover:underline">
                        Home
                    </button>
                    <button onClick={() => router.push('/my-page')} className="text-sm font-medium hover:underline">
                        My Page
                    </button>
                    <button onClick={() => router.push('/projects')} className="text-sm font-medium hover:underline">
                        Projects
                    </button>
                </nav>

                <nav className="ml-auto flex items-center gap-4 sm:gap-6">
                    {!session?.data ? (
                        <button className="p-2 rounded-md bg-primary text-primary-foreground shadow" onClick={handleSignIn}>
                            <LogIn className="h-5 w-5" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 cursor-pointer" onClick={() => router.push('/settings')}>
                                <AvatarImage src={session.data?.user?.image || ''} alt={session.data?.user?.name || 'User'} />
                                <AvatarFallback>{session.data?.user?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <button className="p-2 rounded-md bg-primary text-primary-foreground shadow" onClick={handleSignOut}>
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </nav>
            </div>

            {/* Title & Search Form */}
            <div className="px-4 lg:px-6 h-12 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-primary">
                    {projectId && project ? project.name : "Redmine"}
                </h1>
                
                {/* Project Search Dropdown */}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-64 flex justify-between">
                            <span>Search for projects...</span>
                            <Search className="h-4 w-4 text-gray-400" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                        <Command>
                            <CommandInput 
                                placeholder="Type a project name..." 
                                value={searchQuery} 
                                onValueChange={setSearchQuery} 
                            />
                            <CommandList>
                                <CommandEmpty>No projects found.</CommandEmpty>
                                {projects?.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((project) => (
                                    <CommandItem
                                        key={project.id}
                                        onSelect={() => handleProjectSelect(project.id)}
                                        className="cursor-pointer"
                                    >
                                        {project.name}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </header>
    );
}
