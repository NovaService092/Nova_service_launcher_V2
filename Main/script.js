const loadingScreen = document.querySelector('.loading-screen');
const container = document.querySelector('.container');
const progressBar = document.querySelector('.progress');
const loadingText = document.getElementById('loading-text');
const loginBox = document.querySelector('.login-box');
const createAccountBox = document.querySelector('.create-account-box');

const messages = [
    'Initializing system',
    'Securing connection',
    'Preparing interface',
    'Almost there',
    'Loading Assets',
    'Ready to launch'
];

let messageIndex = 0;
let importButtonClicked = false;

function changeLoadingText() {
    loadingText.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
}

setInterval(changeLoadingText, 1000);

setTimeout(() => {
    progressBar.style.width = '100%';
}, 100);

setTimeout(() => {
    loadingScreen.style.display = 'none';
    container.style.display = 'flex';
    loginBox.classList.add('active');
}, 5000);

function switchForm(form) {
    if (form === 'create') {
        loginBox.classList.remove('active');
        setTimeout(() => {
            loginBox.style.display = 'none';
            createAccountBox.style.display = 'block';
            createAccountBox.classList.add('active');
        }, 300);
    } else {
        createAccountBox.classList.remove('active');
        setTimeout(() => {
            createAccountBox.style.display = 'none';
            loginBox.style.display = 'block';
            loginBox.classList.add('active');
        }, 300);
    }
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
   
    if (!username || !password) {
        showNotification("Please enter both username and password.", "error");
        return;
    }

    let accounts = JSON.parse(localStorage.getItem('accounts')) || {};

    if (accounts[username] && accounts[username] === password) {
        showNotification("Login successful!", "success");
        setTimeout(() => {
            document.querySelector('.container').style.display = 'none';
        }, 2000);
    } else if (username === 'Novaservice' && password === 'admin') {
        showNotification("Admin login successful!", "success");
        setTimeout(showAdminPanel, 2000);
    } else {
        showNotification("Hmm, it seems like this account wasn't created or the password was wrong. Would you like to create one or need help?", "error");
        showLoginOptions();
    }
    onUserLogin();
}

function createAccount() {
    const username = document.getElementById('create-username').value;
    const password = document.getElementById('create-password').value;

    if (!username || !password) {
        showNotification("Please enter both username and password.", 'error');
        return;
    }

    if (!importButtonClicked) {
        shakeScreen();
        shakeElement(document.querySelector('.import-button'));
        showNotification("Please click the import button before creating an account.", 'error');
        return;
    }

    const content = `username: ${username}\npassword: ${password}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Nova_save_files_inject_${username}.txt`;
    a.click();

    const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
    accounts[username] = password;
    localStorage.setItem('accounts', JSON.stringify(accounts));

    showNotification("Account created successfully!", "success");
    setTimeout(() => {
        switchForm('login');
    }, 2000);
   
    importButtonClicked = false;
    document.querySelector('.import-button').classList.remove('imported');
}

function showNotification(message, type) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Force repaint
    notification.offsetHeight;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            container.removeChild(notification);
        }, 300);
    }, 5000);
}


function goToHelpPage() {
    window.location.href = 'help.html';
}

function importAccount() {
    importButtonClicked = true;
    document.querySelector('.import-button').classList.add('imported');
    const username = document.getElementById('create-username').value;
    const password = document.getElementById('create-password').value;
    const content = `username: ${username}\npassword: ${password}`;
    const blob = new Blob([content], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Nova_Service_save_inject.txt';
    a.click();
    showNotification('Account data saved to Nova_Service_save_inject.txt', 'success');
}

function exportAccount() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt';
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                if (content.includes('username:') && content.includes('password:')) {
                    const [username, password] = content.split('\n');
                    document.getElementById('login-username').value = username.replace('username: ', '');
                    document.getElementById('login-password').value = password.replace('password: ', '');
                    showNotification('Account data imported successfully', 'success');
                } else {
                    showNotification('Invalid file content. Please check the file format.', 'error');
                }
            };
            reader.readAsText(file);
        } else {
            showNotification('Please select a text (.txt) file', 'error');
        }
    };
    fileInput.click();
}

function shakeScreen() {
    document.body.classList.add('shake');
    setTimeout(() => {
        document.body.classList.remove('shake');
    }, 500);
}

function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    setupLoadingScreen();
    setupLoginForm();
   
    const createAccountBox = document.querySelector('.create-account-box');
    if (!createAccountBox.querySelector('.import-button')) {
        const importButton = document.createElement('button');
        importButton.className = 'import-button cool-import';
        importButton.innerHTML = '<i class="fas fa-file-import"></i> Import';
        importButton.onclick = importAccount;
        createAccountBox.appendChild(importButton);
    }
   
    document.querySelector('.login-box').innerHTML += '<button onclick="exportAccount()" class="export-button">Export</button>';
    
    // Create notification element if it doesn't exist
    if (!document.getElementById('notification')) {
        const notificationElement = document.createElement('div');
        notificationElement.id = 'notification';
        document.body.appendChild(notificationElement);
    }
})

function setupLoadingScreen() {
    // Loading screen setup logic here
}

function setupLoginForm() {
    // Login form setup logic here
}
