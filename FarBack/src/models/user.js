const mongoose = require('../database');

const UserSchema = new mongoose.Schema({
    code :{
        type : String,
        required : true,
    },
    email : {
        type: String,
        required: true,
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;