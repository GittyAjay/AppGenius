// JavaScript code
document.addEventListener('DOMContentLoaded', function () {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendMessageButton = document.getElementById('sendMessageButton');

    // Function to add user message to chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user';
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
    }

    // Function to add bot message to chat
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot';
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
    }

    // Function to handle user message submission
    function handleMessageSend() {
        const message = userInput.value.trim();
        if (message !== '') {
            addUserMessage(message);
            // Send user message to server for processing by ChatGPT
            fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            })
                .then(response => response.json())
                .then(data => {
                    addBotMessage(data.message); // Display bot's response in chat
                })
                .catch(error => {
                    console.error('Error sending message:', error);
                    addBotMessage('Error occurred. Please try again.'); // Display error message in chat
                });
            userInput.value = ''; // Clear input field after sending message
        }
    }

    // Event listener for send message button click
    sendMessageButton.addEventListener('click', handleMessageSend);

    // Event listener for enter key press in input field
    userInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            handleMessageSend();
        }
    });
});
