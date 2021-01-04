process.env.NODE_ENV = 'test'

const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/model/user/user')
const Question = require('../src/model/questions')

const { users } = require('./fakeUsers')
const user1 = users[0]
const user2 = users[1]
const question = {
    _id: mongoose.Types.ObjectId(),
    title: 'the wealth of nation',
    description: 'how nations grow and become rich',
    owner: user1._id
}

beforeEach(async () => {
    await User.deleteMany()
    await User.create(user1)
    await User.create(user2)
})


const answer = {
    question: question._id,
    _id: mongoose.Types.ObjectId(),
    title: 'the wealth of nation',
    description: 'how nations grow and become rich',
    owner: user2._id
}

describe('Tests User', () => {
    beforeAll(async () => {
        await Question.create(question)
    });

    // tests for user register route
    test('it should throw an error if email exist', async () => {
        const response = await request(app)
            .post('/v1/register')
            .send({
                email: 'masukubebes@gmail.com',
                password: 'masuku',
                name: 'masuku bebes',
                lat: 6.439401999999999,
                long: 3.5266233999999996
            })
            .expect(400)
        // .then(res => {
        //     expect(res.body.message).toBe('user already exist')
        // })
        expect(response.body.message).toBe('user already exist')
    });

    test(`it should thrown an error if user location isn't provided at signup`, async () => {
        const res = await request(app)
            .post('/v1/register')
            .send({
                email: 'masukubebes@gmail.com',
                password: 'masuku',
                name: 'masuku bebes',
            })
            .expect(400)
        expect(res.body.message).toBe('all field (name, email, password, lat, long) is required')
    });

    test(`should signup a user successfully`, async () => {
        const res = await request(app)
            .post('/v1/register')
            .send({
                email: 'sequence@gmail.com',
                password: 'masuku',
                name: 'masuku bebes',
                lat: 6.439401999999999,
                long: 3.5266233999999996
            })
            .expect(201)
        expect(res.body.message).toBe('user created successfully')
    });

    test(`it should throw and error if name or password isn't provided`, async () => {
        const res = await request(app)
            .post('/v1/register')
            .send({
                email: 'sequence@gmail.com',
            })
            .expect(400)
        expect(res.body.message).toBe('all field (name, email, password, lat, long) is required')
    });

    // tests for login routes
    test(`it should throw an error if user does not exist`, async () => {
        const res = await request(app)
            .post('/v1/login')
            .send({
                email: `heady@example.com`,
                password: 'masuku'
            })
            .expect(400)
        expect(res.body.message).toBe('User does not exist')
    });

    test(`it should throw and error if wrong password is inputted`, async () => {
        const res = await request(app)
            .post('/v1/login')
            .send({
                email: 'masukubebes@gmail.com',
                password: 'masu',
            })
            .expect(400)
        expect(res.body.message).toBe(`Incorrect Password`)
    });

    test(`it throw an error if no email or password is passed`, async () => {
        const res = await request(app)
            .post('/v1/login')
            .send({
                email: 'masukubebes@gmail.com',
            })
            .expect(400)
        expect(res.body.message).toBe(`Please enter a valid email and password`)
    });

    test(`it should login a user with correct credentials`, async () => {
        const res = await request(app)
            .post('/v1/login')
            .send({
                email: 'masukubebes@gmail.com',
                password: 'masuku',
            })
            .expect(200)
        expect(res.body.message).toBe(`User logged in successfully`)
    });

    // test for logout routes
    test(`it should not logout a user without auth token`, async () => {
        const res = await request(app)
            .post('/v1/logout')
            .set(`Authorization`, '')
            .expect(401)
        // console.log('>>>>>>>>>>>', res.message)
    })

    test(`it should logout a user`, async () => {
        const res = await request(app)
            .post('/v1/logout')
            .set(`Authorization`, `Bearer ${user1.tokens[0].token}`)
            .expect(200);
        // console.log('>>>>>>>>>>>> ${user1.tokens[0].token}', `${user1.tokens[0].token}`);
    })

    // test for search routes
    test(`it should throw an error authorization not provided`, async () => {
        const res = await request(app)
            .get('/v1/user/search')
            .set('Authorization', '')
            .expect(401)
    })

    test(`it should throw an error if user location is not provided`, async () => {
        const res = await request(app)
            .get('/v1/user/search')
            .set('Authorization', `Bearer ${user1.tokens[0].token}`)
            .expect(400)
        expect(res.body.message).toBe('Please pass the lat and long')
    })

    test(`it should get a user`, async () => {
        const res = await request(app)
            .get('/v1/user/search?&lat=6.439401999999999&long=3.5266233999999996')
            .set('Authorization', `Bearer ${user1.tokens[0].token}`)
            .expect(200)
        // console.log('>>>>>>>>>>>> res', res)
    })

    // add question
    test(`users should add question successfully`, async () => {
        const res = await request(app)
            .post('/v1/question/add')
            .set('Authorization', `Bearer ${user1.tokens[0].token}`)
            .send({
                title: 'Ruby',
                description: 'Data Structures',
                owner: user1._id
            })
            .expect(201)
        // expect(res.body.message).toBe('')
    })

    test('same user should not be able to downvote or upvote', async () => {
        const res = await request(app)
            .patch(`/v1/question/vote/${question._id}`)
            .set('Authorization', `Bearer ${user1.tokens[0].token}`)
            .send({
                vote: false
            })
            .expect(400)
        expect(res.body.message).toBe('You can not vote for a question you created')
    })
});

describe('Questions', () => {
    test('it should throw error if user does not provide title or description', async () => {
        const res = await request(app)
            .post('/v1/question/add')
            .set('Authorization', `Bearer ${user1.tokens[0].token}`)
            .send({
                title: 'Ruby'
            })
            .expect(400)
        expect(res.body.message).toBe(`description is required`)
    });

    test('user should only be able to edit title and description in update', async () => {
        const res = await request(app)
            .put(`/v1/question/update/${question._id}`)
            .set('Authorization', `Bearer ${user1.tokens[0].token}`)
            .send({
                title: 'Java',
                description: 'Kotlin...',
                owner: 'wew'
            })
            .expect(400)
        expect(res.body.message).toBe(`invalid request body`)
    });

    test('user should only be able to edit succesfully', async () => {
        const res = await request(app)
            .put(`/v1/question/update/${question._id}`)
            .set('Authorization', `Bearer ${user1.tokens[0].token}`)
            .send({
                title: 'gitlab',
                description: 'bitbucket github gitlab'
            })
            .expect(200)
        expect(res.body.message).toBe('question updated successfully')
    });
});

describe('Answer', () => {
    test('it should return error when answer is provided for invalid question', async () => {
        let questionId = '5eafd5f38b31f4474a6b531e';
        const res = await request(app)
            .post('/v1/answer/add')
            .set('Authorization', `Bearer ${user2.tokens[0].token}`)
            .expect(400)
            .send({
                title: 'whew',
                description: 'hmmmmm',
                questionId: '5eafd5f38b31f4474a6b531e'
            })
        expect(res.body.message).toBe(`Question with ${questionId} id does not exist`)
        // console.log('>>>>>>>>>>>> res', res.body)
    });

    test('it should return error when invalid Id Type is provided', async () => {
        const res = await request(app)
            .post('/v1/answer/add')
            .set('Authorization', `Bearer ${user2.tokens[0].token}`)
            .expect(400)
            .send({
                title: 'whew',
                description: 'hmmmmm',
                questionId: 'qwetyu083'
            })
        expect(res.body.message).toBe('invalid Id')
    })

    test('it should succesfully add question', async () => {
        const res = await request(app)
            .post('/v1/answer/add')
            .set('Authorization', `Bearer ${user2.tokens[0].token}`)
            .expect(200)
            .send({
                title: 'Crony Capitalism',
                description: 'A bad economic model',
                questionId: question._id
            })
        expect(res.body.data.title).toBe('Crony Capitalism')
    })
})