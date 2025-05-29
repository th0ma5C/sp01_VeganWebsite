const { Schema, model } = require('mongoose');

// Message
const MessageSchema = new Schema({
    conversationId: { type: Schema.Types.ObjectId, ref: 'conversation', required: true, index: true },
    sender: { type: String, enum: ['user', 'admin'], required: true },
    senderId: {
        type: Schema.Types.Mixed,
        ref: 'User',
        required: true,
        index: true
    },
    recipientId: {
        type: Schema.Types.Mixed,
        ref: 'User',
        required: true,
        index: true
    },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true }).index({ updatedAt: -1 });

// Conversation
const ConversationSchema = new Schema({
    userId: {
        type: Schema.Types.Mixed,
        required: true,
        index: true
    },
    username: {
        type: String,
        required: true,
    },
    lastMessage: {
        type: MessageSchema,
        sparse: true,
    },
    status: { type: String, enum: ['open', 'closed'], default: 'open', index: true },
}, { timestamps: true });


module.exports = {
    Message: model('message', MessageSchema),
    Conversation: model('conversation', ConversationSchema)
}