("use strict");

const socket = new WebSocket("http://localhost:3100");

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

socket.onopen = async function loadFiles() {
    const folderList = document.getElementById('files-list')
    const NotFiles = document.getElementById('not-files')
    const userCookie = getCookie('token')

    try {
        const message = {
            action: 'showFolders',
            token: `${getCookie('token')}`
        };
        socket.send(JSON.stringify(message))

        socket.onmessage = (event) => {
            const folders = JSON.parse(event.data);

            if(folders.length <= 0) {
                NotFiles.classList.add('profile-files__body-not-file--active')
            } else {
                NotFiles.classList.remove('profile-files__body-not-file--active')
            }

            folderList.innerHTML = '';

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
            });
        };
    } catch (error) {
        console.error(error);
    }
};

document.getElementById('send-folder-name').addEventListener('click', async (e) => {
    e.preventDefault()

    const overlay = document.getElementById('overlay')
    const modalFolderName = document.getElementById('modal-folder-name')
    const folderNameInput = document.getElementById('folder-name').value;
    const folderName = folderNameInput.trim()

    overlay.classList.remove('overlay--active')
    modalFolderName.classList.remove('modal-folder-name--active')
    setTimeout(() => {
        overlay.style.display = 'none'
        modalFolderName.style.display = 'none'
        document.getElementById('folder-name').value = '';
    }, 100)

    const folderMessage = {
        action: 'createFolder',
        token: `${getCookie('token')}`,
        body: folderName,
    };
    socket.send(JSON.stringify(folderMessage))
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