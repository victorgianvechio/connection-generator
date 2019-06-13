const path = require('path')
const crypto = require('crypto')
const generator = require('../../src/util/dotEnvGenerator.js')
const db = require('../../src/db/dbConnection.js')
const cfg = require('../../src/util/configureOracleClient.js')
const ipc = require('electron').ipcRenderer
const timeout = require('../util/timeout.js')

async function generateFile($, remote) {
    let options = ''
    let user = $('#user').val()
    let pass = $('#pass').val()
    let conn = $('#conn').val()
    let fileName = $('#fileName').val()
    let filePath = $('#filePath').val()
    let key = $('#key').val()
    let algorithm = $('#cryptoAlgorithm').val()

    ipc.send('show-progressbar', 'Gerando Arquivo')
    await generator.createFile(
        user,
        pass,
        conn,
        filePath,
        fileName,
        key,
        algorithm
    )
    await timeout(3000)
    await ipc.send('set-progressbar-completed')

    options = {
        type: 'info',
        title: 'Gerador de Conexão',
        message: 'Arquivo de conexão gerado com sucesso!',
        detail: path.join(filePath, fileName)
    }

    await timeout(500)
    remote.dialog.showMessageBox(null, options)
}

async function configure(remote) {
    let winrarExist = await cfg.checkWinrar()
    let envExist = await cfg.checkEnv()
    let folderExist = await cfg.checkFolder()

    let options = {
        type: '',
        title: 'Gerador de Conexão',
        message: '',
        detail: ''
    }

    if (!winrarExist) {
        options.type = 'warning'
        options.message = 'Necessário instalar Winrar.'
        remote.dialog.showMessageBox(null, options)
        return
    }

    options.type = 'info'
    options.message = 'Configuração realizada com sucesso!'

    if (!folderExist) {
        options.detail += '- Dependências instaladas.\n'
        await ipc.send('show-progressbar', 'Instalando dependências')
        await cfg.extract()
        await timeout(3000)
        await ipc.send('set-progressbar-completed')
    }

    if (!envExist) {
        options.detail +=
            '- Variável de ambiente criada.\n\nNecessário reiniciar a aplicação.'
        await ipc.send('show-progressbar', 'Configurando variável de ambiente')
        await cfg.setEnv()
        await timeout(3000)
        await ipc.send('set-progressbar-completed')
    }

    if (envExist && folderExist)
        options.message = 'Parâmetros e configurações já realizadas.'

    await timeout(500)
    await remote.dialog.showMessageBox(null, options)
    if (!envExist) await remote.getCurrentWindow().close()
}

function selectFolder(remote) {
    let path = remote.dialog.showOpenDialog({
        properties: ['openDirectory']
    })
    $('#filePath').val(path)
}

async function testConnection() {
    let user = $('#user').val()
    let pass = $('#pass').val()
    let conn = $('#conn').val()

    ipc.send('show-progressbar', 'Testando Conexão')
    await db.connect(user, pass, conn).then(async v => {
        if (v === true) {
            options = {
                type: 'info',
                title: 'Gerador de Conexão',
                message: 'Conexão testada com sucesso!',
                detail: 'Pronto para gerar o arquivo.'
            }
        } else {
            options = {
                type: 'error',
                title: 'Gerador de Conexão',
                message: 'Erro ao testar conexão.',
                detail: v
            }
        }
        await timeout(2000)
        await ipc.send('set-progressbar-completed')

        await timeout(500)
        remote.dialog.showMessageBox(null, options)
    })
}

function setCryptoAlgorithm() {
    let algorithms = crypto.getCiphers()

    algorithms.forEach(item => {
        if (item.indexOf('ecb') == -1 && item.indexOf('aes-256') != -1)
            $('#cryptoAlgorithm').append(
                `<option value="${item}">${item.toUpperCase()}</option>`
            )
    })

    $('#cryptoAlgorithm option[value=aes-256-cbc]').attr('selected', 'selected')
}

function generateEncryptionKey() {
    let encryptionKey = crypto.randomBytes(16)
    $('#key').val(encryptionKey.toString('hex'))
}

function validade($, remote) {
    let user = $('#user').val()
    let pass = $('#pass').val()
    let conn = $('#conn').val()
    let fileName = $('#fileName').val()
    let filePath = $('#filePath').val()
    let isValid = true

    let options = {
        type: 'error',
        title: 'Gerador de Conexão',
        message: 'Preencher campos obrigatórios:',
        detail: ''
    }

    if (user === '') {
        options.detail += '- Usuário \n'
        isValid = false
    }

    if (pass === '') {
        options.detail += '- Senha \n'
        isValid = false
    }

    if (conn === '') {
        options.detail += '- String de Conexão \n'
        isValid = false
    }

    if (filePath === '') {
        options.detail += '- Diretório \n'
        isValid = false
    }

    if (fileName === '') {
        options.detail += '- Nome do Arquivo'
        isValid = false
    }

    if (isValid) generateFile($, remote)
    else remote.dialog.showMessageBox(null, options)
}

module.exports = ($, remote) => {
    $('#mainContent').load('../../app/view/components/mainContent.html')

    $(document).ready(() => {
        function getWindow() {
            return remote.BrowserWindow.getFocusedWindow()
        }

        $('#btnSair').click(() => {
            getWindow().close()
        })

        $('#btnGerar').click(() => {
            validade($, remote)
        })

        $('#btnFolder').click(() => {
            selectFolder(remote)
        })

        $('#filePath').click(() => {
            selectFolder(remote)
        })

        $('#btnEncryption').click(() => {
            generateEncryptionKey()
        })

        $('#btnTestar').click(() => {
            testConnection()
        })

        $('#btnConfig').click(() => {
            configure(remote)
        })

        setCryptoAlgorithm()
        generateEncryptionKey()
    })
}
