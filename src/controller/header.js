module.exports = ($, remote) => {
    $('#header').load('../../app/view/components/header.html')

    $(document).ready(() => {
        function getWindow() {
            return remote.BrowserWindow.getFocusedWindow()
        }

        $('#btnCancel').click(() => {
            getWindow().close()
        })

        // $('#btnPlus').click(()=> {
        //     getWindow().isMaximized() ? getWindow().restore() : getWindow().maximize();
        // });

        $('#btnMinus').click(() => {
            getWindow().minimize()
        })
    })
}
