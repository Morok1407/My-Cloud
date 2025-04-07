("use strict");

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlParams_F = urlParams.get('f')
    if(urlParams_F){
        showDataSetToFolder(urlParams_F)
    } else {
        showDataSet()
    }
})

async function showDataSet() {
    try {
        const response = await fetch('/api/showDataSet', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await response.json()
        loadFiles(data)
        if(!data.success) {
            setTimeout(() => {
                showWarn(data.error)
            }, 100)
        }
    } catch (error) {
        console.error(data.error);
        setTimeout(() => {
            showWarn(data.error)
        }, 100)
    }
}

async function showDataSetToFolder(urlParams_F) {
    const nameSection = document.getElementById('section_name')
    
    try {
        const response = await fetch('/api/showDataSetToFolder', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                urlParams_F
            })
        })
        const data = await response.json()
        nameSection.textContent = data.folderName
        loadFiles(data)
        goToBack()
        if(!data.success) {
            setTimeout(() => {
                showWarn(data.error)
            }, 100)
        }
    } catch (error) {
        console.error(data.error);
        setTimeout(() => {
            showWarn(data.error)
        }, 100)
    }
}

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
    const pageNow = location.pathname
    const arrPage = pageNow.split("/");
    const removePage = arrPage.shift()
    const folderId = folder.dataset.id;
    window.location.href = `/${arrPage[0]}?f=${folderId}`;
}

document.getElementById('send-folder-name').addEventListener('click', async (e) => {
    e.preventDefault()

    const overlay = document.getElementById('overlay')
    const modalFolderName = document.getElementById('modal-folder-name')
    const folderNameInput = document.getElementById('folder-name').value;
    const folderName = folderNameInput.trim()
    const urlParams = new URLSearchParams(window.location.search);
    const urlParams_F = urlParams.get('f')

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
            folderName,
            urlParams_F
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
    const urlParams = new URLSearchParams(window.location.search);
    const urlParams_F = urlParams.get('f')
    const file = document.getElementById('creation-file-input').files[0];

    const formData = new FormData()
    formData.append("urlParams_F", JSON.stringify(urlParams_F));
    formData.append("file", file);

    file.value = '';

    const response = await fetch('/api/uploadFile', {
        method: "POST",
        headers: {
            'x-urlParams_F': 'urlParams_F'
        },
        body: formData
    })
    const data = await response.json()
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
    const iconItems = document.querySelectorAll('.icon')
    const names = document.querySelectorAll('.profile-dataSet-name')
    const contextMenuFolder = document.getElementById('context-menu-folder');
    const contextMenuFile = document.getElementById('context-menu-file');
    const menuOpenFolder = document.getElementById('openFolder');
    let currentItem = null;

    items.forEach((item) => {
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            if(item.dataset.type === 'Folder'){
                contextMenuFolder.style.display = 'flex';
                contextMenuFile.style.display = 'none';
                contextMenuFolder.style.left = `${e.pageX}px`;
                contextMenuFolder.style.top = `${e.pageY}px`;
                currentItem = item;
            } else {
                contextMenuFile.style.display = 'flex';
                contextMenuFolder.style.display = 'none';
                contextMenuFile.style.left = `${e.pageX}px`;
                contextMenuFile.style.top = `${e.pageY}px`;
            }
        });
    });
    document.addEventListener('click', function(e) {
        if (contextMenuFolder.style.display === 'flex') {
            contextMenuFolder.style.display = 'none';
        }
        if (contextMenuFile.style.display === 'flex') {
            contextMenuFile.style.display = 'none';
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && contextMenuFolder.style.display === 'flex') {
            contextMenuFolder.style.display = 'none';
        }
        if (e.key === 'Escape' && contextMenuFile.style.display === 'flex') {
            contextMenuFile.style.display = 'none';
        }
    });

    // Controller File
    document.getElementById('downloadFile').addEventListener('click', (e) => {
        e.preventDefault()
        
        console.log("Скачать файл")
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

    // Controller Folder
    menuOpenFolder.replaceWith(menuOpenFolder.cloneNode(true));
    const newOpenFolder = document.getElementById('openFolder');
    newOpenFolder.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentItem) {
            openFolder(currentItem);
        }
    });
    document.getElementById('renameFolder').addEventListener('click', (e) => {
        e.preventDefault()
    
        console.log("Переименовать папку")
    })
    document.getElementById('deleteFolder').addEventListener('click', (e) => {
        e.preventDefault()
    
        console.log("Удалить папку")
    })
    document.getElementById('infoFolder').addEventListener('click', (e) => {
        e.preventDefault()
    
        console.log("Информация о папке")
    })

    iconItems.forEach(e => {
        e.addEventListener('dblclick', () => {
            if(e.parentElement.dataset.type === 'Folder'){
                openFolder(e.parentElement)
            } else {
                console.log('Скачать файл')
            }
        })
    })

    names.forEach((e, i) => {
        e.addEventListener('dblclick', () => {
            console.log(names[i].textContent)
        })
    })
}

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

function goToBack() {
    const backButton = document.getElementById('backFolder')
    if(checkingPage()) {
        backButton.classList.add('back__folder--active')
    }
    backButton.addEventListener('click', () => {
        window.history.back();
        if(!checkingPage()) {
            backButton.classList.remove('back__folder--active')
        }
    })
}

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

function checkingPage() {
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('f')) {
        return true
    } else {
        return false
    }
}