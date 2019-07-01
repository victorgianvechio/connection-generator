/*
  CLASSE RESPONSÁVEL POR TESTAR CONECÇÃO COM O BD
*/
const oracledb = require('oracledb')

const connect = async(user, pass, connString) => {
    let conn = ''
    let result = ''

    try {
        conn = await oracledb.getConnection({
            user: user,
            password: pass,
            connectString: connString
        })
        result = true
        return result
    } catch (err) {
        result = `Error ${err.message}`
        return result
    } finally {
        if (conn) await conn.close()
    }
}

module.exports = {
    connect: connect
}
