import { Request, Response } from 'express';
import { getLinkByOrder, getTaskLinksCount } from '../../services/link.service';
import { getQuestionByOrder, getTaskStageQuestionsCount } from '../../services/question.service';
import { PretaskLinkResp, PretaskQuestionResp, PretaskResp } from '../../types/responses/students.types';
import { getQuestionOptions } from '../../services/option.service';
import { AnswerOptionReq } from '../../types/requests/students.types';
import { createAnswer } from '../../services/answer.service';
import { getTaskStageByOrder } from '../../services/taskStage.service';

export async function root(req: Request<{ taskOrder: number }>, res: Response<PretaskResp>, next: Function) {
    try {
        const { taskOrder } = req.params;
        const { description, keywords, id_task, id_task_stage } = await getTaskStageByOrder(taskOrder, 1);
        res.status(200).json({
            description: description,
            keywords: keywords,
            numLinks: await getTaskLinksCount(id_task),
            numQuestions: await getTaskStageQuestionsCount(id_task_stage)
        });
    } catch (err) {
        next(err);
    }
}

export async function getLink(req: Request<{ taskOrder: number, linkOrder: number }>, res: Response<PretaskLinkResp>, next: Function) {
    try {
        const { taskOrder, linkOrder } = req.params;
        const { id_link, topic, url } = await getLinkByOrder(taskOrder, linkOrder);
        res.status(200).json({ id: id_link, topic, url });
    } catch (err) {
        next(err);
    }
}

export async function getQuestion(req: Request<{ taskOrder: number, questionOrder: number }>, res: Response<PretaskQuestionResp>, next: Function) {
    try {
        const { taskOrder, questionOrder } = req.params;
        
        const { id_question, content, type, img_alt, img_url } = await getQuestionByOrder(taskOrder, 1, questionOrder);
        const options = await getQuestionOptions(id_question);
    
        res.status(200).json({
            content, type,
            id: id_question,
            imgAlt: img_alt || '',
            imgUrl: img_url || '',
            options: options.map(({ id_option, content, correct, feedback }) => ({
                id: id_option,
                content,
                correct,
                feedback: feedback || ''
            })),
        });
    } catch (err) {
        next(err);
    }
}

export async function answer(req: Request<{ taskOrder: number, questionOrder: number }>, res: Response, next: Function) {
    try {
        const { id: idUser } = req.user as ReqUser;
        const { taskOrder, questionOrder } = req.params;
        const { idOption, answerSeconds } = req.body as AnswerOptionReq;
        if (!idOption) return res.status(400).json({ message: 'Missing idOption' });
        
        await createAnswer(idUser, taskOrder, 1, questionOrder, idOption, answerSeconds);
        res.status(200).json({ message: `Answered question ${questionOrder} of task ${taskOrder}` });
    } catch (err) {
        next(err);
    }
}
