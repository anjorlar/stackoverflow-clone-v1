const bcrypt = require('bcrypt')

class EncryptionManager {
    getHashed(password) {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }
    compareHashed(plain, hashed) {
        return bcrypt.compareSync(plain, hashed)
    }
}

const encryptionManager = new EncryptionManager()
module.exports = encryptionManager

// module.exports = new EncryptionManager();