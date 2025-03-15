("use strict");

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/showDataSet', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const data = await response.json()
        loadFiles(data)
    } catch (error) {
        console.error(error);
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

        li.classList.add('profile-folder-item')
        img.classList.add('folders')
        span.classList.add('profile-folder-span')

        img.src = '../img/icon/main-folder.svg'
        span.textContent = folder.name

        folderList.appendChild(li);
        li.appendChild(img)
        li.appendChild(span)
    });
    files.forEach(file => {
        console.log(file)
    })
    controllerFiles()
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
    const items = document.querySelectorAll('.profile-folder-item')
    const files = document.querySelectorAll('.folders')
    const spans = document.querySelectorAll('.profile-folder-span')
    
    items.forEach((item, index) => {
        const childrenNodes = item.childNodes
        
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
            console.log('Открытие файла')
        })
    })

    spans.forEach((e, i) => {
        e.addEventListener('dblclick', () => {
            console.log(spans[i].textContent)
        })
    })
}

document.getElementById('openFile').addEventListener('click', (e) => {
    e.preventDefault()

    console.log("Открыть файл")
})
document.getElementById('renameFile').addEventListener('click', (e) => {
    e.preventDefault()

    console.log("Переименовать файл")
})
document.getElementById('deleteFile').addEventListener('click', (e) => {
    e.preventDefault()

    console.log("Удалить файл")
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
    modalWarnText.textContent = `${warn}`
}