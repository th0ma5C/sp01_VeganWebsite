const express = require('express');
const router = express.Router();
const QuestionnaireModel = require('@models/QuestionnaireModel');
const SurveyResultModel = require('@models/QuestionnaireResultModel');
const GptResultModel = require('@models/GptResultModel');
const User = require('@models/User');
const { authToken, authUser } = require('@middlewares/userValidator');
const mockData = require('./mockGPT/GPT_res_v1.json');
const { setTimeout } = require('timers/promises');
const OpenAI = require('openai');
const { system_prompt, response_format } = require('./gptClient/prompt');

router.get('/getQuestionnaire', async (req, res) => {
    try {
        const data = await QuestionnaireModel.find();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
})

// member create survey data
router.post('/saveResult/:step', authUser, async (req, res) => {
    const tokenPayload = req.user;
    const surveyResult = req.body.data.result;
    const step = req.params.step;
    try {
        const user = await User.exists({
            _id: tokenPayload.userID
        });
        if (!user) {
            return res.status(404).json({
                msg: 'user not found',
                state: 'denied'
            })
        };
        const userId = tokenPayload.userID;

        if (!surveyResult || typeof surveyResult !== 'object' || !Object.keys(surveyResult).length) {
            return res.status(422).json({ msg: 'Invalid survey result data', state: 'denied' });
        }

        let msg;
        const updateSurveyResult = async (model, userIdQuery, surveyResult) => {
            return await model.updateOne(
                { ...userIdQuery },
                { $set: surveyResult },
                { runValidators: true, upsert: true }
            );
        };

        if (step !== 'gpt') {
            const query = {
                userId
            }
            await updateSurveyResult(SurveyResultModel, query, surveyResult);
            // await SurveyResultModel.updateOne(
            //     { userId },
            //     { $set: surveyResult },
            //     { runValidators: true, upsert: true }
            // )
            msg = 'user survey result saved'
        } else {
            const query = {
                gpt_user: userId
            }
            await updateSurveyResult(GptResultModel, query, surveyResult);
            // await GptResultModel.updateOne(
            //     { userId },
            //     { $set: surveyResult },
            //     { runValidators: true, upsert: true }
            // )
            msg = 'user gpt result saved'
        }

        res.status(200).json({
            msg,
            state: 'confirm'
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Internal server error' });
    }
})

// member get saved survey result
router.get('/result/:target', authUser, async (req, res) => {
    const { userID: userId } = req.user;
    const target = req.params.target;
    try {
        // const userId = tokenPayload.userID;
        if (!userId) {
            return res.status(404).json({
                msg: 'user not found',
                state: 'denied'
            })
        }

        let result
        if (target !== 'gpt') {
            result = await SurveyResultModel.findOne({ userId });
        } else {
            const gpt_user = userId
            result = await GptResultModel.findOne({ gpt_user });
        }

        if (!result) {
            return res.status(404).json({
                msg: 'Survey result not found',
                state: 'denied'
            });
        }

        res.status(200).json({
            result,
            state: 'confirm'
        })
    } catch (error) {
        res.status(400).json({ error: 'Internal server error' });
    }
})

// member delete survey
router.delete('/result/:userId', async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            msg: 'bad request',
            state: 'denied'
        })
    }

    try {
        const GPTResult = await GptResultModel.findOneAndDelete({ gpt_user: userId });
        const SurveyResult = await SurveyResultModel.findOneAndDelete({ userId });

        if (!GPTResult && !SurveyResult) {
            return res.status(404).json({
                msg: 'No records found to delete',
                state: 'none'
            });
        }

        res.status(200).json({
            msg: 'reset survey result',
            state: 'confirm',
            deleted: {
                GPTResult: !!GPTResult,
                SurveyResult: !!SurveyResult
            }
        })

    } catch (error) {
        console.error('DELETE /result error:', error);
        res.status(500).json({
            msg: 'Internal server error',
            error: error.message
        });
    }
})

// gpt response

const openai = new OpenAI({
    apiKey: process.env.GPT_API_KEY,
});

// completion.then((result) => console.log(result.choices[0].message));


router.post('/gpt-analyze', async (req, res) => {
    try {
        const { surveyResult } = req.body;
        const user_prompt = JSON.stringify(surveyResult);

        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": system_prompt
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": user_prompt
                        }
                    ]
                },
            ],
            response_format,
            temperature: 1,
            max_completion_tokens: 5120,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            store: true
        });

        const { blocks: result } = JSON.parse(gptResponse.choices[0].message.content);
        // const result = mockData;
        if (!result) return res.status(404).json({
            state: 'error',
            message: 'Internal server error, please retry later'
        })

        res.status(200).json({
            result,
            state: 'confirm'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


module.exports = router