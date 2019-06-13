const crypto = require('./cryptoGenerator.js')
const fs = require('fs')
const path = require('path')

function createFile(user, pass, conn, filePath, fileName, key, algorithm) {
    const stream = fs.createWriteStream(path.join(filePath, fileName))

    stream.once('open', () => {
        stream.write(`ENCRYPTION_KEY="${key}"\n`)
        stream.write(`ALGORITHM="${algorithm}"\n`)
        stream.write(`DB_USER="${crypto.encrypt(user, key, algorithm)}"\n`)
        stream.write(`DB_PASS="${crypto.encrypt(pass, key, algorithm)}"\n`)
        stream.write(`CONNECT_STRING="${conn}"`)
        stream.end()
    })
}

module.exports = { createFile }
