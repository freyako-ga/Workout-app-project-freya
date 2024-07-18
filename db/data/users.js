const bcrypt = require('bcrypt')

module.exports = [
    {
        username: 'admin',
        password: bcrypt.hashSync('pass', 10)
    },
    {
        username: 'freyako',
        password: bcrypt.hashSync('pass', 10)
    }
]


