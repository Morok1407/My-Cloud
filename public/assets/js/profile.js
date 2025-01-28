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
    const modalFolderName = document.getElementById('modal-folder-name')

    overlay.style.display = 'flex'
    modalFolderName.style.display = 'flex'
    setTimeout(() => {
        overlay.classList.add('overlay--active')
        modalFolderName.classList.add('modal-folder-name--active')
    }, 100)
})

function closeModal() {
    const overlay = document.getElementById('overlay')
    const modalFolderName = document.getElementById('modal-folder-name')
    const close = document.getElementById('close-modal')

    close.addEventListener('click', () => {
        overlay.classList.remove('overlay--active')
        modalFolderName.classList.remove('modal-folder-name--active')
        setTimeout(() => {
            overlay.style.display = 'none'
            modalFolderName.style.display = 'none'
        }, 100)
    })

    overlay.addEventListener('click', () => {
        overlay.classList.remove('overlay--active')
        modalFolderName.classList.remove('modal-folder-name--active')
        setTimeout(() => {
            overlay.style.display = 'none'
            modalFolderName.style.display = 'none'
        }, 100)
    })
}closeModal()

document.getElementById('creation-file').addEventListener('click', () => {
    const fileInput = document.getElementById('creation-file-input')

    fileInput.click()
})

document.getElementById('send-folder-name').addEventListener('click', async () => {
    const overlay = document.getElementById('overlay')
    const modalFolderName = document.getElementById('modal-folder-name')
    const folderName = document.getElementById('folder-name').value;

    overlay.classList.remove('overlay--active')
    modalFolderName.classList.remove('modal-folder-name--active')
    setTimeout(() => {
        overlay.style.display = 'none'
        modalFolderName.style.display = 'none'
        document.getElementById('folder-name').value = '';
    }, 100)

    const response = await fetch('/api/creatFolder', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            folderName
        }),
    })

    const data = await response.json();
    if(data.success) {
        alert(data.message)
    } else {
        alert('Ошибка: ' + data.error);
    }
})