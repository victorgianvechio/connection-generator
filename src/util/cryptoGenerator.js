const crypto = require('crypto')
const IV_LENGTH = 16

function encrypt(text, key, algorithm) {
    let iv = crypto.randomBytes(IV_LENGTH)
    let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv)
    let encrypted = cipher.update(text)

    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex')
}

function decrypt(text, key, algorithm) {
    let textParts = text.split(':')
    let iv = new Buffer.from(textParts.shift(), 'hex')
    let encryptedText = new Buffer.from(textParts.join(':'), 'hex')
    let decipher = crypto.createDecipheriv(algorithm, new Buffer.from(key), iv)
    let decrypted = decipher.update(encryptedText)

    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
}

module.exports = { decrypt, encrypt }
