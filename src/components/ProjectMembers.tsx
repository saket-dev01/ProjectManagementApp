// ProjectMembers.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Member {
  id: string;
  name: string | null;
  image: string | null;
}

interface ProjectMembersProps {
  members: Member[];
}

const ProjectMembers: React.FC<ProjectMembersProps> = ({ members }) => {
  return (
    <div className="flex gap-3 mt-2">
      {members.map(member => (
        <Avatar key={member.id} className="h-10 w-10">
          <AvatarImage src={member.image || ""} alt={member.name || "User"} />
          <AvatarFallback>{member.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
};

export default ProjectMembers;
