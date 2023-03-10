import { AnswerModel } from "../models";
import { Answer, AnswerCreation } from "../types/Answer.types";
import { getQuestionByOrder } from "./question.service";

export async function answerQuestion(
    taskOrder: number,
    taskStageOrder: number,
    questionOrder: number,
    idOption: number,
    answerSeconds: number,
    idTaskAttempt: number
): Promise<Answer> {
    const { id_question } = await getQuestionByOrder(
        taskOrder,
        taskStageOrder,
        questionOrder
    );
    return await AnswerModel.create({
        id_question,
        id_task_attempt: idTaskAttempt,
        id_option: idOption,
        answer_seconds: answerSeconds,
    });
}

export async function createAnswer(answer: AnswerCreation): Promise<Answer> {
    const newAnswer = await AnswerModel.create(answer);
    return newAnswer;
}
