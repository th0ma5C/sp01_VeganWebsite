const express = require('express');
const router = express.Router();
const { Message, Conversation } = require('@models/ChatModel');
const jwt = require('jsonwebtoken');

async function authJWT(req, res, next) {
    let token = req.params.token
    try {
        // const { email, isGuest = false, userID = null } = jwt.verify(token, process.env.JWT_SECRET);
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload) {
            return res.status(401).json({
                state: 'denied'
            })
        }
        req.user = payload;
        next();
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: '請重新登入', state: 'denied' });
    }
}

// create conversation
router.post('/conversation/:token', authJWT, async (req, res) => {
    const { userID, username } = req.user
    try {
        if (!userID) {
            res.status(401).json({
                state: 'denied'
            })
        }
        const savedConversation = await Conversation.create({
            userId: userID,
            username
        });

        res.status(200).json({
            state: 'confirm',
            savedConversation
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            state: 'denied',
            msg: 'internal server error'
        })
    }
})

// async function createConversationStateList(query) {
//     try {
//         return await Conversation.aggregate([
//             // 1. 篩選指定使用者的對話
//             { $match: { ...query } },

//             // 2. 根據 _id 對應 message 的 conversationId
//             {
//                 $lookup: {
//                     from: 'messages', // 注意這裡要用 collection 名稱（通常是小寫 + 複數）
//                     localField: '_id',
//                     foreignField: 'conversationId',
//                     as: 'messages'
//                 }
//             },

//             // 3. 加欄位：messages 中 updatedAt 最新的那筆（先排序再切第一筆）
//             {
//                 $addFields: {
//                     lastMessage: {
//                         $arrayElemAt: [
//                             {
//                                 $slice: [
//                                     {
//                                         $filter: {
//                                             input: "$messages",
//                                             as: "msg",
//                                             cond: {} // 可選加條件，例如：只要 read: true 的訊息
//                                         }
//                                     },
//                                     -1
//                                 ]
//                             },
//                             0
//                         ]
//                     }
//                 }
//             },

//             // 4. 移除 messages 整包（你只需要 lastMessage）
//             {
//                 $project: {
//                     messages: 0
//                 }
//             },

//             // 5. 排序整體 conversation（optional）
//             {
//                 $sort: {
//                     updatedAt: -1
//                 }
//             }
//         ]);
//     } catch (error) {
//         throw new Error(error)
//     }
// }

// get conversation list
router.get('/conversation/:token', authJWT, async (req, res) => {
    const user = req.user
    try {
        if (!user) {
            res.status(402).json({
                state: 'denied'
            })
        }

        if (user.role == 'user') {
            // const conversationList = await createConversationStateList({ userId: user.userID });
            const conversationList = await Conversation.find({ userId: user.userID });

            res.status(200).json({
                state: 'confirm',
                conversationList,
            })
        } else if (user.role == 'admin') {
            const conversationList = await Conversation.find({ status: 'open' });

            res.status(200).json({
                state: 'confirm',
                conversationList,
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            state: 'denied',
            msg: 'internal server error'
        })
    }
})

// admin close conversation
router.patch('/conversation/close/:token', authJWT, async (req, res) => {
    const { conversationId } = req.body;
    try {
        if (!conversationId) {
            return res.status(404)
        }

        const closedConversation = await Conversation.findByIdAndUpdate(
            conversationId,
            { status: 'closed' },
            { new: true }
        );

        res.status(200).json({
            state: 'confirm',
            closedConversation
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            state: 'denied',
            msg: 'internal server error'
        })
    }
})

// get message of conversation
router.get('/message/:token', authJWT, async (req, res) => {
    const user = req.user
    try {
        if (!user) {
            res.status(402).json({
                state: 'denied'
            })
        }
        console.log(user.userID);
        // const msgList = await Message.find({ conversationId }).sort({ createdAt: -1 });
        const msgList = await Message.find({
            $or: [
                { senderId: user.userID },
                { recipientId: user.userID }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({
            state: 'confirm',
            msgList
        })
    } catch (error) {

    }
})

// read message
router.patch('/message/read/:token', authJWT, async (req, res) => {
    const { msgIdList } = req.body;
    const user = req.user;

    if (!Array.isArray(msgIdList) || msgIdList.length === 0 || !user) {
        return res.status(404).json({ message: 'messageIds is required' });
    }

    try {
        const result = await Message.updateMany(
            {
                _id: { $in: msgIdList },
                recipientId: user.userID,
                read: false
            },
            {
                $set: { read: true }
            }
        );

        res.status(200).json({
            state: 'confirm',
            updatedCount: result.modifiedCount
        });
    } catch (err) {
        console.error('Error updating messages:', err);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;