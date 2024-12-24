const { Schema, model } = require('mongoose');
const itemSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        itemType: { type: String, required: true },
        hsnCode: { type: String },
        purchaseRate: { type: Number, required: true },
        quantity: { type: Number },
        gst: { type: Number, required: true },
        sellingPrice: { type: Number },
        discount: { type: Number }
    },
    {
        timestamps: true
    }
);

const Item = model('Item', itemSchema);
module.exports = Item;
