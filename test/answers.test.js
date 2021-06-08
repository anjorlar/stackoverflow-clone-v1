process.env.NODE_ENV = 'test'

const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const Answer = require('../src/model/answers')
const Question = require('../src/model/questions')
const { users } = require('./fakeUsers')
const user_2 = users[1]

const question = {
    _id: mongoose.Types.ObjectId(),
    title: 'Docker',
    description: 'Deployment pipeline',
    owner: user_2._id
};

const answer = {
    question: question._id,
    _id: mongoose.Types.ObjectId(),
    title: 'Docker',
    description: 'for contenarization',
    owner: user_2._id
}

describe('Answers', () => {
    beforeAll(async () => {
        await Question.deleteMany()
        await Answer.deleteMany()
        await Question.create(question)
        await Answer.create(answer)
    });

    test('it should require content to search', async () => {
        const res = await request(app)
            .get('/v1/answer/search')
            .expect(400)
        expect(res.body.message).toBe('please add content to search')
    })


    test('it should get content if search criteria matches answers', async () => {
        const res = await request(app)
            .get('/v1/answer/search?a=cont')
            .expect(200)
        expect(res.body.message).toBe(`All answers retrieved successfully`)
    })
})