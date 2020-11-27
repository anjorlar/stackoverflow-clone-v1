const User = require('../model/user/user');
const Follow = require('../model/follow');

class UserServices {

    //get user that has the fields that was passed in
    getUser(email) {
        console.log('>>>> email', email)
        return User.findOne({ email: email }).exec()
    }


    //create a new user object
    createUser(data) {
        console.log('>>>> data data', data)
        return new User(data)
    }

    followQuestion(data) {
        return Follow.create(data)
    }

    //search user with search details
    search(search, limit, page) {
        return User.find(search)
            .limit(limit)
            .skip(page)
            .sort({
                // title: 'asc'
                name: 'asc'
            }).exec()
    }


    //A mongoose method that helps to verify user credentials
    verifyEmail(email, password) {
        return User.verifyDetails(email, password)
    }
}

const userService = new UserServices()
module.exports = userService;