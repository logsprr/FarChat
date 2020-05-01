const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://farchat:1234@cluster0-duexj.mongodb.net/userscode?retryWrites=true&w=majority',{
    useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;

module.exports = mongoose;