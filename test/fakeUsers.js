const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const userId_1 = mongoose.Types.ObjectId("5e997cd018e0bec1199ad8d4")
const userId_2 = mongoose.Types.ObjectId("5e997cd018e0bec1199ad8d5")

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
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmJmY2JjOTNiNjFhMGMxMmEwZTIyNDEiLCJlbWFpbCI6ImFkZUBtZS5jb20iLCJuYW1lIjoiQWRlIFRhaXdvIiwiaWF0IjoxNjA2NDA1MDY1fQ.fsaNfMKHVTThm_R0PdyuTiZTX_8sk-3XeGIitZ9myxM'
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
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWIxMjljNTkyYTNlZDVjYTNlZWEyMWMiLCJpYXQiOjE1ODg2NjkyODN9.T8ODt01FqyFeVcJlVwTpJflN-meB5h92ZYgNE7Nwa_g'
            }
        ]
    },
]