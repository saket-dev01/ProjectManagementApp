import { TaskCreationForm } from "~/components/TaskCreationForm"


export default function Page(){
    return (
        <TaskCreationForm onClose={()=>{console.log("closed called")}}></TaskCreationForm>
    )
}