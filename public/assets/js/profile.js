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
    const sectionName = document.getElementById('section_name')
    try {
        const response = await fetch('/api/showDataSet', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await response.json()
        sectionName.textContent = data.name
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
    const directoryMap = document.getElementById('directoryMap')
    const directoryMapSpan = document.getElementById('directoryMapSpan')
    const pageNow = location.pathname
    const arrPage = pageNow.split("/");
    arrPage.shift()
    
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
        const arrPath = data.path.split("\\")
        arrPath.shift(), arrPath.shift()
        if(checkingPage()) {
            directoryMap.style.display = 'flex'
            directoryMapSpan.textContent = `${arrPage[0]}:\\${arrPath.join('\\')}`
        } else {
            directoryMap.style.display = 'none'
        }
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
        const a = document.createElement('a')
        const img = document.createElement('img')
        const span = document.createElement('span')

        li.dataset.type = file.mimeType
        li.dataset.id = file._id

        li.classList.add('profile-dataSet-item')
        img.classList.add('icon')
        img.style.display = 'block'
        span.classList.add('profile-dataSet-name')
        a.classList.add('profile-dataSet-link')
        a.href = `/api/downloadFile/${file._id}`
        img.src = `/assets/img/profile icon/${checkType(file.mimeType)}.png`;
        span.textContent = file.fileName

        a.addEventListener('click', (e) => {
            e.preventDefault();
        });
        
        a.addEventListener('dblclick', () => {
            window.location.href = a.href;
        });

        folderList.appendChild(li);
        li.appendChild(a)
        li.appendChild(span)
        a.appendChild(img)
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

async function renameItem(item, renameText) {
    const urlParams = new URLSearchParams(window.location.search);
    const urlParams_F = urlParams.get('f')
    const itemId = item.dataset.id
    const itemType = item.dataset.type

    try {
        const response = await fetch('/api/rename', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                itemId,
                itemType,
                renameText,
                urlParams_F
            })
        })
        const data = await response.json()
        if(!(data.message === 'Not difference')) {
            loadFiles(data)
        }
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

async function infoItem(item) {
    const itemType = item.dataset.type
    const itemId = item.dataset.id

    if(itemType === 'Folder') {
        try {
            const response = await fetch('/api/infoFolder', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    itemId
                })
            })
            const data = await response.json()
            showAlert(`Информация о папке: "${data.folder[0].folderName}"`, 'List-folder', data)
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
    } else {
        try {
            const response = await fetch('/api/infoFile', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    itemId
                })
            })
            const data = await response.json()
            showAlert(`Информация о файле: "${data.file[0].fileName}"`, 'List-file', data)
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
}

async function deleteFile(file) {
    const fileId = file.dataset.id
    const urlParams = new URLSearchParams(window.location.search);
    const urlParams_F = urlParams.get('f')
    try {
        const response = await fetch('/api/deleteFile', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fileId,
                urlParams_F
            })
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

async function deleteFolder(folder) {
    const folderId = folder.dataset.id
    const urlParams = new URLSearchParams(window.location.search);
    const urlParams_F = urlParams.get('f')
    try {
        const response = await fetch('/api/deleteFolder', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                folderId,
                urlParams_F
            })
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

let currentItemFolder = null;
let currentItemFile = null;
function controllerFiles() {
    const items = document.querySelectorAll('.profile-dataSet-item')
    const iconItems = document.querySelectorAll('.icon')
    const names = document.querySelectorAll('.profile-dataSet-name')
    const contextMenuFolder = document.getElementById('context-menu-folder');
    const contextMenuFile = document.getElementById('context-menu-file');

    items.forEach((item) => {
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            if(item.dataset.type === 'Folder'){
                contextMenuFolder.style.display = 'flex';
                contextMenuFile.style.display = 'none';
                contextMenuFolder.style.left = `${e.pageX}px`;
                contextMenuFolder.style.top = `${e.pageY}px`;
                currentItemFolder = item;
            } else {
                contextMenuFile.style.display = 'flex';
                contextMenuFolder.style.display = 'none';
                contextMenuFile.style.left = `${e.pageX}px`;
                contextMenuFile.style.top = `${e.pageY}px`;
                currentItemFile = item;
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

    iconItems.forEach(e => {    
        e.addEventListener('dblclick', () => {
            if(e.parentElement.dataset.type === 'Folder'){
                openFolder(e.parentElement)
            }
        })
    })

    names.forEach((e, i) => {
        e.addEventListener('dblclick', () => {
            if(e.parentElement.dataset.type === 'Folder') {
                currentItemFolder = e.parentElement
                showAlert(`Переименование папки`, 'Input-Folder', e.parentElement)
            } else {
                currentItemFile = e.parentElement
                showAlert(`Переименование файла`, 'Input-File', e.parentElement)
            }
        })
    })
}

// ControllerFile
document.getElementById('downloadFile').addEventListener('click', (e) => {
    e.preventDefault()
    
    const linkFile = currentItemFile.querySelector('.profile-dataSet-link')
    window.location.href = linkFile.href;
})
document.getElementById('renameFile').addEventListener('click', (e) => {
    e.preventDefault()

    showAlert(`Переименование файла`, 'Input-File', currentItemFile)
})
document.getElementById('infoFile').addEventListener('click', (e) => {
    e.preventDefault()
    
    infoItem(currentItemFile)
})
document.getElementById('deleteFile').addEventListener('click', (e) => {
    e.preventDefault()

    showAlert(`Вы действительно хотите удалить файл "${currentItemFile.querySelector('.profile-dataSet-name').textContent}"?`, 'Buttons')
})
document.getElementById('modal-alert-button-yes').addEventListener('click', () => {
    if(currentItemFile) {
        deleteFile(currentItemFile)
        currentItemFile = null;
    }
})

// Controller Folder
document.getElementById('openFolder').addEventListener('click', (e) => {
    e.preventDefault();

    openFolder(currentItemFolder)
});
document.getElementById('renameFolder').addEventListener('click', (e) => {
    e.preventDefault()

    showAlert(`Переименование папки`, 'Input-Folder', currentItemFolder)
})
document.getElementById('infoFolder').addEventListener('click', (e) => {
    e.preventDefault()
    
    infoItem(currentItemFolder)
})
document.getElementById('deleteFolder').addEventListener('click', (e) => {
    e.preventDefault()

    showAlert(`Вы действительно хотите удалить папку вместе со всем содержимым "${currentItemFolder.querySelector('.profile-dataSet-name').textContent}"?`, 'Buttons')
})
document.getElementById('modal-alert-button-yes').addEventListener('click', () => {
    if(currentItemFolder) {
        deleteFolder(currentItemFolder)
        currentItemFolder = null;
    }
})

// Creation Folder and File
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
    const folderNameInput = document.getElementById('folder-name')

    overlay.style.display = 'flex'
    modalFolderName.style.display = 'flex'
    setTimeout(() => {
        overlay.classList.add('overlay--active')
        modalFolderName.classList.add('modal-folder-name--active')
        folderNameInput.focus()
    }, 100)
})
document.getElementById('creation-file').addEventListener('click', () => {
    const fileInput = document.getElementById('creation-file-input')

    fileInput.click()
})

function closeModal() {
    const overlay = document.getElementById('overlay')
    const modalFolderName = document.getElementById('modal-folder-name')
    const modalwarn = document.getElementById('modal-warn')
    const modalAlert = document.getElementById('modal-alert')
    const modalAlertList = document.getElementById('modal-alert-list')
    const modalAlertInputFolder = document.getElementById('modal-alert-input-folder')
    const modalAlertInputFile = document.getElementById('modal-alert-input-file')
    const modalAlertButtons = document.getElementById('modal-alert-buttons')
    const inputRenameSubmitFolder = document.getElementById('input-rename-submit-folder')
    const inputRenameSubmitFile = document.getElementById('input-rename-submit-file')

    overlay.classList.remove('overlay--active')
    modalFolderName.classList.remove('modal-folder-name--active')
    modalwarn.classList.remove('modal-warn--active')
    modalAlert.classList.remove('modal-alert--active')
    modalAlertInputFolder.value = ''
    modalAlertInputFile.value = ''
    setTimeout(() => {
        overlay.style.display = 'none'
        modalFolderName.style.display = 'none'
        modalwarn.style.display = 'none'
        modalAlert.style.display = 'none'
        modalAlertList.style.display = 'none'
        modalAlertList.innerHTML = ''
        modalAlert.style.top = `90px`
        modalAlertInputFolder.style.display = 'none'
        modalAlertInputFile.style.display = 'none'
        modalAlertButtons.style.display = 'none'
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

function goToBack() {
    const goToBackButtons = document.getElementById('goBackButtons')
    const backButton = document.getElementById('backFolder')
    const backToHome = document.getElementById('backToHome')
    if(checkingPage()) {
        goToBackButtons.classList.add('profile-goback-button--active')
    }
    backButton.addEventListener('click', () => {
        window.history.back();
        if(!checkingPage()) {
            goToBackButtons.classList.remove('profile-goback-button--active')
        }
    })
    backToHome.addEventListener('click', () => {
        const pageNow = location.pathname
        const arrPage = pageNow.split("/");
        const removePage = arrPage.shift()
        goToBackButtons.classList.remove('profile-goback-button--active')
        window.location.href = `/${arrPage[0]}`;
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

function showAlert(alert, modifier, info) {
    const overlay = document.getElementById('overlay')
    const modalAlert = document.getElementById('modal-alert')
    const modalAlertText = document.getElementById('modal-alert-text')
    const modalAlertList = document.getElementById('modal-alert-list')
    const modalAlertInputFolder = document.getElementById('modal-alert-input-folder')
    const modalAlertInputFile = document.getElementById('modal-alert-input-file')
    const modalAlertButtons = document.getElementById('modal-alert-buttons')
    const modalAlertButtonYes = document.getElementById('modal-alert-button-yes')
    const modalAlertButtonNo = document.getElementById('modal-alert-button-no')
    const inputRenameFolder = document.getElementById('input-rename-folder')
    const inputRenameFile = document.getElementById('input-rename-file')
    
    overlay.classList.add('overlay--active')
    modalAlert.classList.add('modal-alert--active')
    setTimeout(() => {
        overlay.style.display = 'flex'
        modalAlert.style.display = 'flex'
    }, 100)
    modalAlertText.textContent = alert

    switch(modifier) {
        case 'List-file': 
            showDataInfoFile(info)
            modalAlertList.style.display = 'flex'
            setTimeout(() => {
                showAlertHeight()
            }, 100)
            break;
        case 'List-folder': 
        showDataInfoFolder(info)
            modalAlertList.style.display = 'flex'
            setTimeout(() => {
                showAlertHeight()
            }, 100)
            break;
            case 'Buttons':
                modalAlertButtons.style.display = 'flex'
                setTimeout(() => {
                    showAlertHeight()
                }, 100)
                break;
        case 'Input-Folder':
            modalAlertInputFolder.style.display = 'flex'
            inputRenameFolder.value = info.querySelector('.profile-dataSet-name').textContent
            setTimeout(() => {
                inputRenameFolder.focus()
                showAlertHeight()
            }, 100)
            break;
        case 'Input-File':
            modalAlertInputFile.style.display = 'flex'
            inputRenameFile.value = info.querySelector('.profile-dataSet-name').textContent
            setTimeout(() => {
                inputRenameFile.focus()
                showAlertHeight()
            }, 100)
            break;
    }

    modalAlertButtonYes.addEventListener('click', () => {
        closeModal()
    })
    modalAlertButtonNo.addEventListener('click', () => {
        closeModal()
    })
}

document.getElementById('input-rename-submit-folder').addEventListener('click', (e) => {
    e.preventDefault()
    const inputRenameFolder = document.getElementById('input-rename-folder')
    closeModal()
    renameItem(currentItemFolder, inputRenameFolder.value)
})
document.getElementById('input-rename-submit-file').addEventListener('click', (e) => {
    e.preventDefault()
    const inputRenameFile = document.getElementById('input-rename-file')
    closeModal()
    renameItem(currentItemFile, inputRenameFile.value)
})

function showDataInfoFile(fileInfo) {
    const modalAlertList = document.getElementById('modal-alert-list')
    const { fileName, mimeType, path, size, uploadedAt } = fileInfo.file[0]
    const arrPath = path.split("\\")
    arrPath.shift(), arrPath.shift()
    const liName = document.createElement('li')
    const liType = document.createElement('li')
    const liPath = document.createElement('li')
    const liSize = document.createElement('li')
    const liTime = document.createElement('li')

    liName.innerHTML = `Имя файла: <span>${fileName}</span>`
    liType.innerHTML = `Тип файла: <span>${mimeType}</span>`
    liPath.innerHTML = `Путь к файлу файла: <span>${fileInfo.user[0].name}\\${arrPath.join('\\')}</span>`
    liSize.innerHTML = `Размер файла: <span>${sizeCalculation(size)}</span>`
    liTime.innerHTML = `Время создание файла: <span>${formatDateForSNG(uploadedAt)}</span>`

    modalAlertList.appendChild(liName);
    modalAlertList.appendChild(liType);
    modalAlertList.appendChild(liPath);
    modalAlertList.appendChild(liSize);
    modalAlertList.appendChild(liTime);
}
function showDataInfoFolder(folderInfo) {
    const modalAlertList = document.getElementById('modal-alert-list')
    const { folderName, path, createdAt } = folderInfo.folder[0]
    const arrPath = path.split("\\")
    arrPath.shift(), arrPath.shift()
    const liName = document.createElement('li')
    const liPath = document.createElement('li')
    const liSize = document.createElement('li')
    const liTime = document.createElement('li')
    const liСontains = document.createElement('li')
    
    liName.innerHTML = `Имя папки: <span>${folderName}</span>`
    liPath.innerHTML = `Путь к папке: <span>${folderInfo.user[0].name}\\${arrPath.join('\\')}</span>`
    liSize.innerHTML = `Размер папки: <span>${sizeCalculation(folderInfo.sumSizeFiles)}</span>`
    liTime.innerHTML = `Время создание папки: <span>${formatDateForSNG(createdAt)}</span>`
    liСontains.innerHTML = `Содержит: <span>Файлов: ${folderInfo.itemLength.filesLength}; Папок: ${folderInfo.itemLength.foldersLength - 1}</span>`
    
    modalAlertList.appendChild(liName);
    modalAlertList.appendChild(liPath);
    modalAlertList.appendChild(liSize);
    modalAlertList.appendChild(liTime);
    modalAlertList.appendChild(liСontains);
}

function sizeCalculation(size) {
    if (size < 1024) {
        return `${size} Байт`;
    } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} КилоБайт`;
    } else if (size < 1024 * 1024 * 1024) {
        return `${(size / 1024 / 1024).toFixed(1)} МегаБайт`;
    } else {
        return `${(size / 1024 / 1024 / 1024).toFixed(1)} Гигабайт`;
    }
}

function formatDateForSNG(isoDateString) {
    const date = new Date(isoDateString);
    
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Moscow'
    };
    
    return date.toLocaleString('ru-RU', options);
}

function showAlertHeight() {
    const modalAlert = document.getElementById('modal-alert');
    const firstStyle = 227;
    const styles = getComputedStyle(modalAlert);
    let differenceHeight = modalAlert.offsetHeight - firstStyle;
    let differenceTop = Number(styles.top.replace(/\D/g, '')) - differenceHeight;
    modalAlert.style.top = `${differenceTop}px`
}

function checkingPage() {
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('f')) {
        return true
    } else {
        return false
    }
}