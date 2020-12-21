const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email:  String,
    password: String,
    group: String,
    refreshToken: String,
    queues: [{id: String, name: String}],
});

const User = mongoose.model('User', userSchema);

User.find({ 'email': 'louis-frederic.fortier@waiting-time.com' }, 'email', function (err, user) {
    if (err) console.log(err);
    if (!user[0]) {
        User.create({
            email: 'louis-frederic.fortier@waiting-time.com',
            password: process.env.WT_ADMIN_PASSWORD,
            group: 'God',
            refreshToken: '',
            queues: [{id: '1', name: 'Queue numéro 1'}],
        }, function (err) {
            if (err) console.log(err);
            console.log('user louis-frederic.fortier@waiting-time.com added');
        });
    }
})

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
} = process.env;

const options = {
    useNewUrlParser: true,
    connectTimeoutMS: 10000,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
};

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

console.log(url);

mongoose.connect(url, options).then( function() {
    console.log('MongoDB is connected');
});

const mongooseConnection = mongoose.connection;

mongooseConnection.on('error', console.error.bind(console, 'connection error:'));

module.exports = {
    mongooseConnection,
    User,
};