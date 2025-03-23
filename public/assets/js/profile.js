("use strict");

const pageNow = location.pathname

document.addEventListener('DOMContentLoaded', async () => {
    const nameSection = document.getElementById('section_name')
    try {
        const response = await fetch('/api/showDataSet', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pageNow
            }),
        })
        const data = await response.json()
        if(data.folderName) {
            nameSection.textContent = data.folderName
        }
        loadFiles(data)
        if(!data.success) {
            showWarn(data.error)
        }
    } catch (error) {
        console.error(data.error);
    }
})

async function loadFiles(data) {
    const folderList = document.getElementById('files-list')
    const NotFiles = document.getElementById('not-files')

    const { folders, files } = await data;
    
    if(folders.length <= 0 && files.length <= 0) {
        NotFiles.classList.add('profile-files__body-not-file--active')
    } else {
        NotFiles.classList.remove('profile-files__body-not-file--active')
    }
    
    folderList.innerHTML = '';
    
    folders.forEach(folder => {
        const li = document.createElement('li');
        const img = document.createElement('img')
        const span = document.createElement('span')

        li.dataset.type = folder.mimeType
        li.dataset.id = folder._id

        li.classList.add('profile-dataSet-item')
        img.classList.add('icon')
        span.classList.add('profile-dataSet-name')

        img.src = '/assets/img/profile icon/folder.svg'
        span.textContent = folder.folderName

        folderList.appendChild(li);
        li.appendChild(img)
        li.appendChild(span)
    });
    files.forEach(file => {
        const li = document.createElement('li');
        const img = document.createElement('img')
        const span = document.createElement('span')

        li.dataset.type = file.mimeType
        li.dataset.id = file._id

        li.classList.add('profile-dataSet-item')
        img.classList.add('icon')
        img.style.display = 'block'
        span.classList.add('profile-dataSet-name')

        img.src = `/assets/img/profile icon/${checkType(file.mimeType)}.png`;
        span.textContent = file.filename

        folderList.appendChild(li);
        li.appendChild(img)
        li.appendChild(span)
    })
    controllerFiles()
}
function checkType(type) {
    const matches = type.match(/([\w-]+)(?=[.\/]|$)/g);
    switch(matches[matches.length - 1]) {
        case 'document':
            return 'document';
        case 'pdf':
            return 'pdf';
        case 'png':
            return 'png';
        case 'x-zip-compressed':
            return 'zip'
        case 'x-compressed':
            return 'rar'
        default: 
            return 'default'
    }
}

async function openFolder(folder) {
    const folderId = folder.dataset.id;
    const userPage = location.pathname;
    const nameSection = document.getElementById('section_name')

    try {
        const response = await fetch('/api/openFolder', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pageNow,
                folderId
            }),
        })
        const data = await response.json();
        console.log(data)
        window.history.pushState(null, '', `${userPage}/${data.folderName}`)
        nameSection.textContent = data.folderName
        loadFiles(data)
    } catch(error) {
        showWarn(error)
    }
}

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
    } else {
        loadFiles(data)
    }
})

document.getElementById('creation-file-input').addEventListener('input', async () => {
    const file = document.getElementById('creation-file-input').files[0];

    const formData = new FormData()
    formData.append('file', file)

    file.value = '';

    const response = await fetch("/api/uploadFile", { 
        method: "POST",
        body: formData 
    });

    const data = await response.json();
    if(!data.success) {
        setTimeout(() => {
            showWarn(data.error)
        }, 100)
    } else {
        loadFiles(data)
    }
})


function controllerFiles() {
    const items = document.querySelectorAll('.profile-dataSet-item')
    const files = document.querySelectorAll('.icon')
    const names = document.querySelectorAll('.profile-dataSet-name')
    
    items.forEach((item, index) => {
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault()

            const contextMenu = document.getElementById('context-menu')
            contextMenu.style.display = 'flex'
            
            contextMenu.style.left = `${e.pageX}px`;
            contextMenu.style.top = `${e.pageY}px`;
        })
    })    
    document.addEventListener('click', function(e) {
        const contextMenu = document.getElementById('context-menu')
        if (contextMenu.style.display === 'flex') {
            contextMenu.style.display = 'none';
        }
    });
    document.addEventListener('keydown', function(e) {
        const contextMenu = document.getElementById('context-menu');
        if (e.key === 'Escape' && contextMenu.style.display === 'flex') {
            contextMenu.style.display = 'none';
        }
    });

    files.forEach(e => {
        e.addEventListener('dblclick', () => {
            openFolder(e.parentElement)
        })
    })

    names.forEach((e, i) => {
        e.addEventListener('dblclick', () => {
            console.log(names[i].textContent)
        })
    })
}

document.getElementById('openFile').addEventListener('click', (e) => {
    e.preventDefault()
    openFolder()
})
document.getElementById('renameFile').addEventListener('click', (e) => {
    e.preventDefault()

    console.log("Переименовать файл")
})
document.getElementById('deleteFile').addEventListener('click', (e) => {
    e.preventDefault()

    console.log("Удалить файл")
})
document.getElementById('infoFile').addEventListener('click', (e) => {
    e.preventDefault()

    console.log("Информация о файле")
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

    overlay.classList.remove('overlay--active')
    modalFolderName.classList.remove('modal-folder-name--active')
    modalwarn.classList.remove('modal-warn--active')
    setTimeout(() => {
        overlay.style.display = 'none'
        modalFolderName.style.display = 'none'
        modalwarn.style.display = 'none'
    }, 100)
}

document.getElementById('close-modal').addEventListener('click', () => {
    closeModal()
})

document.getElementById('overlay').addEventListener('click', () => {
    closeModal()
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal()
    }
});

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
    modalWarnText.textContent = warn
}