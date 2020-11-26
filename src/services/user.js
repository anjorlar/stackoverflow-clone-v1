const User = require('../model/user/user');

class UserServices {
    getUser(email) {
        console.log('>>>> email', email)
        return User.findOne({ email: email }).exec()
    }
    createUser(data) {
        console.log('>>>> data data', data)
        return new User(data)
    }
}

const userService = new UserServices()
module.exports = userService;