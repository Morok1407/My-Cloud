document.getElementById('creation-button').addEventListener('click', () => {
    const button = document.getElementById('creation-button-plus')
    const folder = document.getElementById('creation-folder')
    const file = document.getElementById('creation-file')

    button.classList.toggle('plus--active')
    folder.classList.toggle('creation-folder--active')
    file.classList.toggle('creation-file--active')
})

document.getElementById('creation-folder').addEventListener('click', () => {
    const overlay = document.getElementById('overlay')
    const modalFileName = document.getElementById('modal-file-name')

    overlay.style.display = 'flex'
    modalFileName.style.display = 'flex'
    setTimeout(() => {
        overlay.classList.add('overlay--active')
        modalFileName.classList.add('modal-file-name--active')
    }, 100)
})

function closeModal() {
    const overlay = document.getElementById('overlay')
    const modalFileName = document.getElementById('modal-file-name')
    const close = document.getElementById('close-modal')

    close.addEventListener('click', () => {
        overlay.classList.remove('overlay--active')
        modalFileName.classList.remove('modal-file-name--active')
        setTimeout(() => {
            overlay.style.display = 'none'
            modalFileName.style.display = 'none'
        }, 100)
    })

    overlay.addEventListener('click', () => {
        overlay.classList.remove('overlay--active')
        modalFileName.classList.remove('modal-file-name--active')
        setTimeout(() => {
            overlay.style.display = 'none'
            modalFileName.style.display = 'none'
        }, 100)
    })
}closeModal()

document.getElementById('creation-file').addEventListener('click', () => {
    const fileInput = document.getElementById('creation-file-input')

    fileInput.click()
})