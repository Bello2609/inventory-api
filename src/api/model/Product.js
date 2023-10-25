const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        category: true
    },
    sku:{
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model("Product", productSchema);