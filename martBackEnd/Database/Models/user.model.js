const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true },
        password: { type: String, required: true },
        phoneNumber: { type: String },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: true
        },
        refresh_token: {
            type: String
        },
        activeStatus: {
            type: Boolean,
            default: false
        },
        profileImage: {
            type: String
        }
    },
    {
        timestamps: true // Enable timestamps for createdAt and updatedAt fields
    }
);

const User = model('User', userSchema);
module.exports = User;
