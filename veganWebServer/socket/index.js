require('module-alias/register');
const jwt = require('jsonwebtoken')
const { Schema, model, Types } = require('mongoose');
const { Message, Conversation } = require('@models/ChatModel');
const User = require('@models/User');

async function saveMessage(data) {
    try {
        const savedMsg = Message.create(data);
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = async (io) => {
    try {
        const { _id } = await User.findOne({ role: 'admin' }).select('_id').lean() || {};
        const adminId = _id.toString() ?? '';
        if (!adminId) throw new Error('admin ID not found');

        io.use((socket, next) => {
            const token = socket.handshake.auth.userToken;
            if (!token) {
                return next(new Error('Authentication token missing'));
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.user = decoded;
                next();
            } catch (err) {
                console.warn(err)
                return next(new Error('Authentication failed'));
            }
        });

        io.on('connection', (socket) => {
            console.log('使用者已連線:', socket.id)

            // admin lobby
            socket.on('joinAdminLobby', (userId) => socket.join(userId));
            socket.on('adminJoinUserRoom', (roomId) => {
                socket.join(roomId);
                socket.emit('conversationReady', { roomId });
            });

            socket.on('userCreateConversation', (conversationId) => {
                // join room
                socket.join(conversationId);

                // invite admin
                io.to(adminId).emit('newUserConversation', { conversationId });

                // conversation established
                socket.emit('conversationReady', { conversationId });
            })

            socket.on('joinConversation', (conversationId) => {
                // join room
                socket.join(conversationId);
            })

            socket.on('sendMessage', async (message) => {
                console.log(message.sender, 'send msg');
                try {
                    const isAdmin = message.sender == 'admin'
                    const data = {
                        ...message,
                    }
                    if (!message.recipientId) data.recipientId = adminId
                    // const data = {
                    //     ...message,
                    //     recipientId: isAdmin ?
                    //         new Types.ObjectId(String(message.senderId)):
                    //         new Types.ObjectId(String(adminId)) 
                    // }
                    const newMsg = await Message.create(data);

                    const updatedConversation = await Conversation.findByIdAndUpdate(
                        new Types.ObjectId(String(message.conversationId)),
                        {
                            lastMessage: newMsg
                        },
                        {
                            new: true,
                            upsert: true,
                            setDefaultsOnInsert: true
                        }
                    )
                    if (newMsg && updatedConversation) {
                        const notification = {
                            updatedConversation,
                            newMsg
                        }
                        // socket.emit('sendMsgSuccess', notification);
                        io.to(String(newMsg.conversationId)).emit('receiveMessage', notification);
                    }
                } catch (error) {
                    console.log(error);
                }
            })

            socket.on('adminCloseConversation', (closedConversation) => {
                io.to(closedConversation._id).emit('closeConversation', closedConversation)
            })

            // socket.on('disconnect', (reason) => {
            //     console.log('Socket 已斷線，原因:', reason);
            // });
        });


    } catch (error) {
        console.log(error);
    }
};
