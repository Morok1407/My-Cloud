document.addEventListener('DOMContentLoaded', async function loadFiles() {
    const folderList = document.getElementById('files-list')
    const NotFiles = document.getElementById('not-files')

    try {
        const response = await fetch('/api/showFolders', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        })

        if (!response.ok) throw new Error("Ошибка загрузки папок");

        const folders = await response.json();
        if(folders.length <= 0) {
            NotFiles.classList.add('profile-files__body-not-file--active')
        }
        folders.forEach(folder => {
            const li = document.createElement('li');
            const img = document.createElement('img')
            const span = document.createElement('span')
            li.classList.add('profile-folder-item')
            img.src = '../img/icon/main-folder.svg'
            span.textContent = folder.name
            folderList.appendChild(li);
            li.appendChild(img)
            li.appendChild(span)
            console.log(folder.name)
        });
    } catch (error) {
        console.error(error);
    }
})

document.getElementById('send-folder-name').addEventListener('click', async (e) => {
    e.preventDefault()

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
    if(!data.success) {
        setTimeout(() => {
            showWarn(data.error)
        }, 100)
    }
})

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
    const modalwarn = document.getElementById('modal-warn')
    const close = document.getElementById('close-modal')

    close.addEventListener('click', () => {
        overlay.classList.remove('overlay--active')
        modalFolderName.classList.remove('modal-folder-name--active')
        modalwarn.classList.remove('modal-warn--active')
        setTimeout(() => {
            overlay.style.display = 'none'
            modalFolderName.style.display = 'none'
            modalwarn.style.display = 'none'
        }, 100)
    })

    overlay.addEventListener('click', () => {
        overlay.classList.remove('overlay--active')
        modalFolderName.classList.remove('modal-folder-name--active')
        modalwarn.classList.remove('modal-warn--active')
        setTimeout(() => {
            overlay.style.display = 'none'
            modalFolderName.style.display = 'none'
            modalwarn.style.display = 'none'
        }, 100)
    })
}closeModal()

document.getElementById('creation-file').addEventListener('click', () => {
    const fileInput = document.getElementById('creation-file-input')

    fileInput.click()
})

function showWarn(warn) {
    const overlay = document.getElementById('overlay')
    const modalwarn = document.getElementById('modal-warn')
    const modalWarnText = document.getElementById('modal-warn-text')

    overlay.classList.add('overlay--active')
    modalwarn.classList.add('modal-warn--active')
    setTimeout(() => {
        overlay.style.display = 'flex'
        modalwarn.style.display = 'flex'
    }, 100)
    modalWarnText.textContent = `${warn}`
}