import { TaskCreationForm } from "~/components/TaskCreationForm";

export default function Page() {
    function onClose() {
        console.log("Close clicked");
    }

    return (
        <div className="flex justify-center items-start pt-16 min-h-screen">
            <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg">
                <TaskCreationForm onClose={onClose} />
            </div>
        </div>
    );
}
