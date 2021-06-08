const Jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const userId_1 = mongoose.Types.ObjectId("5feb486057044ad25c5aa459")
// const userId_1 = new mongoose.Types.ObjectId()
const userId_2 = mongoose.Types.ObjectId("5feb48bb57044ad25c5aa45b")
// const userId_2 = new mongoose.Types.ObjectId()

exports.users = [
    {
        _id: userId_1,
        email: 'masukubebes@gmail.com',
        password: 'masuku',
        name: 'masuku bebes',
        location: {
            coordinates: [6.439401999999999, 3.5266233999999996]
        },
        tokens: [
            {
                access: 'auth',
                token:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmViNDg2MDU3MDQ0YWQyNWM1YWE0NTkiLCJlbWFpbCI6Im1hc3VrdWJlYmVzQGdtYWlsLmNvbSIsIm5hbWUiOiJtYXN1a3UgYmViZXMiLCJpYXQiOjE2MDkyNTUwMDh9.QAyUN8W1ZtvObecbGspIcAoLFqRR9PkaQz_C3sxRtmE'
                // Jwt.sign({ _id: userId_1 }, process.env.JWTSECRET)
            }
        ]
    },
    {
        _id: userId_2,
        email: 'kumurchi@gmail.com',
        password: 'kumurchi',
        name: 'Tsawa kumurchi',
        location: {
            coordinates: [6.439401999999999, 3.5266233999999996]
        },
        tokens: [
            {
                access: 'auth',
                token:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmViNDhiYjU3MDQ0YWQyNWM1YWE0NWIiLCJlbWFpbCI6Imt1bXVyY2hpQGdtYWlsLmNvbSIsIm5hbWUiOiJUc2F3YSBrdW11cmNoaSIsImlhdCI6MTYwOTI1NTA5OX0.RsdBBOC2RRjBO38BkLzowhhWVSXacvGC24J6jP8_U4c'
                // Jwt.sign({ _id: userId_2 }, process.env.JWTSECRET)
            }
        ]
    },
]