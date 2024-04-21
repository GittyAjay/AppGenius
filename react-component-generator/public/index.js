document.addEventListener('DOMContentLoaded', function () {
    var socket = io();
    var input = document.querySelector('.chat-input-box');
    var sendButton = document.querySelector('.send-button');
    var chatMessagesContainer = document.querySelector('.chat-messages-container');
    var welcomeTextContainer = document.querySelector('.chat-welcome-text'); // Added reference to welcome text container
    var welcomeTextBox = document.querySelector('.welcomeTextContainer');
    function appendMessage(message, isSentByCurrentUser, isFileDownloaded) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', isSentByCurrentUser ? 'sent-message' : 'received-message');
        if (isFileDownloaded) {
            const messageWrapper = document.createElement('div');
            const messageText = document.createElement('span');
            messageText.textContent = message;
            const downloadIcon = document.createElement('img');
            downloadIcon.src = 'assets/download.png';
            downloadIcon.classList.add('download-icon');
            const downloadButton = document.createElement('button');
            downloadButton.classList.add('download-icon');
            downloadButton.appendChild(downloadIcon);
            downloadButton.onclick = function () {
                window.location.href = '/download';
            };
            messageWrapper.appendChild(messageText);
            messageWrapper.appendChild(downloadButton);
            messageElement.appendChild(messageWrapper);
        }
        else if (!isSentByCurrentUser) {
            const messageWrapper = document.createElement('div');
            const messageText = document.createElement('span');
            messageText.textContent = message;
            messageWrapper.appendChild(messageText);
            messageElement.appendChild(messageWrapper);
        } else {
            const messageText = document.createElement('span');
            messageText.textContent = message;
            messageElement.appendChild(messageText);
        }
        chatMessagesContainer.appendChild(messageElement);
    }
    function addLoadingBubble() {
        const loadingBubble = document.createElement('div');
        loadingBubble.classList.add('loading-bubble');
        const dotContainer = document.createElement('div');
        dotContainer.classList.add('dot-container');
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dotContainer.appendChild(dot);
        }
        loadingBubble.appendChild(dotContainer);
        chatMessagesContainer.appendChild(loadingBubble);
    }

    function removeLoadingBubble() {
        const loadingBubble = document.querySelector('.loading-bubble');
        if (loadingBubble) {
            loadingBubble.remove();
        }
    }
    sendButton.addEventListener('click', function () {
        sendMessage();
    });

    async function callApi(instruction) {
        try {
            const form = new FormData();
            form.append('instruction', instruction);
            const response = await fetch('/submit', {
                method: 'POST',
                body: form,
            });
            const api_response = await response.json()
            const message = api_response.message
            console.log("===api response", message);
            if (response.ok) {
                appendMessage(message, false, true);
            } else {
                appendMessage(message, false);
            }
        } catch (error) {
            console.error('Error:', error);
            appendMessage(message, false);
        } finally {
            removeLoadingBubble();

        }
    }
    function sendMessage() {
        var message = input.value.trim();
        console.log("=====given message", message);
        if (message !== '') {
            appendMessage(message, true);
            socket.emit('chat message', message);
            input.value = '';
            callApi(message)
            welcomeTextContainer.classList.add('hide'); // Hide welcome text when message is sent
        }
    }

    input.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });



    socket.on('chat message', function () {
        addLoadingBubble();
    });

    welcomeTextBox.addEventListener('click', function (event) {
        if (event.target.classList.contains('chat-message')) {
            const instruction = event.target.textContent.trim();
            console.log("====welcomeTextBtn", instruction);
            appendMessage(instruction, true);
            socket.emit('chat message', instruction);
            input.value = '';
            callApi(instruction)
            welcomeTextContainer.classList.add('hide');
        }
    });
});
