const exec = require('child_process').execSync

// Verifica se existe variável de ambiente
const checkEnv = () => {
    let result = false

    let stdout = exec('set PATH', err => {
        if (err) console.error('Error checkEnv', err)
    })

    if (stdout.toString('utf8').indexOf('oracle-instant-client') == -1)
        result = false
    else result = true

    console.log('env:', result)
    return result
}

// Verifica se a pasta existe
const checkFolder = () => {
    let result = false

    let stdout = exec('cd "C:\\Program Files (x86)" && dir', err => {
        if (err) console.error('Error checkFolder', err)
    })

    if (stdout.toString('utf8').indexOf('oracle-instant-client') == -1)
        result = false
    else result = true

    console.log('folder:', result)
    return result
}

// Verifica se existe winrar instalado
const checkWinrar = () => {
    let result = false

    let stdout = exec('cd "%ProgramFiles%\\WinRAR" && dir', err => {
        if (err) console.error('Error checkWinrar', err)
    })

    stdout = stdout.toString('utf8').toLowerCase()

    if (stdout.indexOf('winrar.exe') == -1) result = false
    else result = true

    console.log('winrar:', result)
    return result
}

// Extrai os arquivos necessários no diretório C:/Arquivos de Programas (x86)
const extract = () => {
    exec(
        `"%ProgramFiles%\\WinRAR\\winrar.exe" x -ibck "${__dirname}\\oracle-instant-client.rar" "C:\\Program Files (x86)"`,
        err => {
            if (err) console.log('Error extract', err)
        }
    )
}

// Cria variável de ambiente
const setEnv = () => {
    exec(
        `setx /M PATH "C:\\Program Files (x86)\\oracle-instant-client;%PATH%"`,
        err => {
            if (err) console.log('Error setEnv:', err)
        }
    )
}

module.exports = {
    checkFolder: checkFolder,
    checkWinrar: checkWinrar,
    checkEnv: checkEnv,
    extract: extract,
    setEnv: setEnv
}
