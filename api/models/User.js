const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    location : { type: Object, required: false },
    fcmtoken: { type: String, required: false },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;