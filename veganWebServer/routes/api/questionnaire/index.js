const express = require('express');
const router = express.Router();
const QuestionnaireModel = require('@models/QuestionnaireModel');
const SurveyResultModel = require('@models/QuestionnaireResultModel');
const User = require('@models/User');
const { authToken, authUser } = require('@middlewares/userValidator');
const mockData = require('./mockGPT/GPT_res.json');
const { setTimeout } = require('timers/promises');


router.get('/getQuestionnaire', async (req, res) => {
    try {
        const data = await QuestionnaireModel.find();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
})

// TODO:member survey CRUD
// member create survey data
router.post('/saveResult', authUser, async (req, res) => {
    const tokenPayload = req.user;
    const surveyResult = req.body.data.result;
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
        await SurveyResultModel.updateOne(
            { userId },
            { $set: surveyResult },
            { runValidators: true, upsert: true }
        )
        res.status(200).json({
            msg: 'user survey result saved',
            state: 'confirm'
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Internal server error' });
    }
})

// member get saved survey result
router.get('/result', authUser, async (req, res) => {
    const { userID: userId } = req.user;
    try {
        // const userId = tokenPayload.userID;
        if (!userId) {
            return res.status(404).json({
                msg: 'user not found',
                state: 'denied'
            })
        }

        const result = await SurveyResultModel.findOne({ userId });
        if (!result) {
            return res.status(404).json({
                msg: 'Survey result not found',
                state: 'denied'
            });
        }

        return res.status(200).json({
            result,
            state: 'confirm'
        })
    } catch (error) {
        res.status(400).json({ error: 'Internal server error' });
    }
})

// gpt response
router.post('/gpt-analyze', async (req, res) => {
    try {
        const form = req.body.data;
        const result = mockData;
        await setTimeout(3000);
        return res.status(200).json({
            result,
            state: 'confirm'
        })
    } catch (error) {
        res.status(400).json({ error: 'Internal server error' });
    }
})


module.exports = router