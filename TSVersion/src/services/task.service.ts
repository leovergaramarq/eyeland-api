import Task from "../models/Task";
import { getLinks } from './pretask.service'
import { getQuestions } from './inTask.service'

export async function taskCount(): Promise<number> {
    return await Task.count();
}

export async function getAllLinksByOrder(taskOrder: number): Promise<any> {
    // throw new Error("Method not implemented.");
    const task = (await Task.findOne({where: {orden: taskOrder}}));

    if(!task){
        return null;
    }
    return getLinks({id_task: task.id_task});
}

//! Refactorize this function
export async function getTaskQuestionsByOrder(taskOrder: number): Promise<any> {
    // throw new Error("Method not implemented.");
    const task = (await Task.findOne({where: {orden: taskOrder}}));
    
    if(!task){
        return null;
    }
    return (await getQuestions({id_task: task.id_task}));
}