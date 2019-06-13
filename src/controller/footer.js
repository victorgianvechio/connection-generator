module.exports = $ => {
    $('#footer').load('../../app/view/components/footer.html')
    $(document).ready(() => {
        document.getElementById('electron-version').innerText =
            process.versions.electron
    })
}
