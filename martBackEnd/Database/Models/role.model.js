const { Schema, model } = require('mongoose');

const roleSchema = new Schema(
    {
        role: { type: String, required: true, unique: true },
        roleActive: { type: Boolean, required: true, default: true },
        priority: { type: Number, required: true },
        permissions: [{ type: String }]
    },
    {
        timestamps: true
    }
);

const Role = model('Role', roleSchema);
module.exports = Role;
