module.exports = $ => {
    $('#footer').load('../../app/view/components/footer.html')
    $(document).ready(function() {
        document.getElementById('electron-version').innerText = process.versions.electron
    })
}
