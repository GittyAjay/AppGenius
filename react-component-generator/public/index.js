document.addEventListener('DOMContentLoaded', function () {
    var socket = io();
    var input = document.querySelector('.chat-input-box');
    var sendButton = document.querySelector('.send-button');
    var chatMessagesContainer = document.querySelector('.chat-messages-container');
    var welcomeTextContainer = document.querySelector('.chat-welcome-text'); // Added reference to welcome text container
    var welcomeTextBtn = document.querySelector('.welcomeTextContainer'); // Added reference to welcome text container

    function appendMessage(message, isSentByCurrentUser) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', isSentByCurrentUser ? 'sent-message' : 'received-message');
        const messageText = document.createElement('span');
        messageText.textContent = message;

        messageElement.appendChild(messageText);
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
            if (response.ok) {
                appendMessage("App is saved in download folder", false);
            } else {
                appendMessage("oo there is some error in generating app", false);
            }
        } catch (error) {
            console.error('Error:', error);
            appendMessage("oo there is some error in generating app", false);
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

    welcomeTextBtn.addEventListener('click', function (event) {
        if (event.target.classList.contains('chat-message')) {
            const instruction = event.target.textContent.trim();
            appendMessage(instruction, true);
            socket.emit('chat message', instruction);
            input.value = '';
            callApi(instruction)
            welcomeTextContainer.classList.add('hide');
        }
    });
});
