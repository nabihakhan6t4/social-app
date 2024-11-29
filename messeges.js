$(document).ready(function() {
    // Code inside this function runs when the document is fully loaded
    // The $ symbol is a shortcut for jQuery, a JavaScript library
    // $(document).ready ensures that the code runs only after the DOM is fully loaded

    // Event handler for click event on send button
    $('#send-btn').click(function() {
        sendMessage(); // Call the sendMessage function when the button is clicked
    });

    // Event handler for keypress event in the message input field
    $('#message-input').keypress(function(e) {
        if (e.which === 13) { // Check if the Enter key (key code 13) is pressed
            sendMessage(); // Call the sendMessage function when Enter key is pressed
        }
    });

    // Function to handle sending messages
    function sendMessage() {
        var message = $('#message-input').val(); // Get the value of the message input field
        if (message.trim() !== '') { // Check if the message is not empty or just whitespace
            appendMessage('user', message); // Append the user message to the chat
            $('#message-input').val(''); // Clear the input field
            setTimeout(function() { // Delay the bot response by 1000 milliseconds (1 second)
                appendMessage('bot', getBotResponse(message)); // Append the bot response to the chat
            }, 1000);
        }
    }

    // Function to append messages to the chat window
    function appendMessage(sender, message) {
        // Determine the CSS class based on the sender (user or bot)
        var messageClass = sender === 'user' ? 'message user' : 'message bot';
        // Create HTML for the message
        var messageElement = `
            <div class="${messageClass}">
                <div class="message-content">${message}</div>
            </div>
        `;
        $('.messages').append(messageElement); // Append the message HTML to the chat window
        // Scroll to the bottom of the chat window to show the latest message
        $('.chatbox-body').scrollTop($('.chatbox-body')[0].scrollHeight);
    }

    // Function to generate bot responses based on user messages
    function getBotResponse(message) {
        // Convert message to lowercase for case-insensitive comparison
        var lowerCaseMessage = message.toLowerCase();

        // Simple bot response logic
        if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('assalamualaikum')) {
            return 'Hello! How can I help you today?'; // Response for greetings
        } else if (lowerCaseMessage.includes('how are you')) {
            return 'I am fine thanks for asking. What about you? 🐺'; // Response for asking about the bot's well-being
        }else if (lowerCaseMessage.includes('i am fine')) {
            return 'good to hear this 🐺'; 
        }  
        else if (lowerCaseMessage.includes('okay bye')) {
            return 'Okay, goodbye! Take care!! 😊👋'; // Response for saying goodbye
        }
        return 'Sorry, I did not understand that.'; // Default response if no other condition is met
    }

    // Event handler for click event on chatbox close button
    $('.chatbox-close').click(function() {
        $('.chatbox').hide(); // Hide the chatbox when the close button is clicked
    });
});