process.env.NODE_ENV = 'test'

const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
// const Answer = require('../src/model/answers')
const Question = require('../src/model/questions')
const { users } = require('./fakeUsers')
const user_1 = users[0]

const question = {
    _id: mongoose.Types.ObjectId(),
    title: 'javascript',
    description: 'primitive types',
    owner: user_1._id
};
// console.log('....', question)
describe('View Question', () => {
    beforeAll(async () => {
        await Question.deleteMany()
        await Question.create(question)
    })

    test('it should throw error for invalid type', async () => {
        const res = await request(app)
            .get('/v1/question/view/5eaedb5e0f0ecb1c45e')
            .expect(400)
        expect(res.body.message).toBe('invalid Id')
    })

    test('it should throw question not found for invalid questionId', async () => {
        let id = `5eaedb5e0f0ecb1c45ef1d7a`
        const res = await request(app)
            .get(`/v1/question/view/5eaedb5e0f0ecb1c45ef1d7a`)
            .expect(400)
        // expect(res.body.message).toBe('question not found')
        expect(res.body.message).toBe(`Question with ${id} id does not exist`)
    })

    test('it should get question succesfully', async () => {
        const res = await request(app)
            .get(`/v1/question/view/${question._id}`)
            .expect(200)
        expect(res.body.data.question.description).toBe('primitive types')
        expect(res.body.message).toBe('questions and answers gotten successfully')
    })

    test('it should throw an error if content to search is not provided', async () => {
        const res = await request(app)
            .get('/v1/question/search')
            .expect(400)
        expect(res.body.message).toBe('please add content to search')
    })

    test('it should get content if search criteria matches', async () => {
        const res = await request(app)
            .get('/v1/question/search?&q=ja')
            .expect(200)
        expect(res.body.message).toBe('All questions retrieved successfully')
        // expect(res.body)
    })
})