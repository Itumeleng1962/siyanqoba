// Chat Widget Functionality
class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.messageCount = 0;
        this.init();
    }

    init() {
        this.chatButton = document.getElementById('chatButton');
        this.chatWindow = document.getElementById('chatWindow');
        this.chatClose = document.getElementById('chatClose');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatNotification = document.getElementById('chatNotification');
        this.quickReplies = document.querySelectorAll('.quick-reply');

        this.bindEvents();
        this.showInitialNotification();
    }

    bindEvents() {
        // Toggle chat window
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.chatClose.addEventListener('click', () => this.closeChat());

        // Send message
        this.chatSend.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick replies
        this.quickReplies.forEach(button => {
            button.addEventListener('click', (e) => {
                const message = e.target.getAttribute('data-message');
                this.sendUserMessage(message);
                this.handleQuickReply(message);
            });
        });

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.chat-widget') && this.isOpen) {
                // Don't close immediately, let user interact
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.chatWindow.classList.add('active');
        this.chatButton.classList.add('active');
        this.hideNotification();
        this.chatInput.focus();
        
        // Add opening animation
        setTimeout(() => {
            this.chatWindow.style.transform = 'translateY(0)';
            this.chatWindow.style.opacity = '1';
        }, 10);
    }

    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.remove('active');
        this.chatButton.classList.remove('active');
        
        // Add closing animation
        this.chatWindow.style.transform = 'translateY(20px)';
        this.chatWindow.style.opacity = '0';
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (message) {
            this.sendUserMessage(message);
            this.chatInput.value = '';
            
            // Simulate agent response
            setTimeout(() => {
                this.sendAgentResponse(message);
            }, 1000 + Math.random() * 2000);
        }
    }

    sendUserMessage(message) {
        const messageElement = this.createMessageElement(message, 'user');
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    sendAgentResponse(userMessage) {
        let response = this.generateResponse(userMessage);
        const messageElement = this.createMessageElement(response, 'agent');
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    createMessageElement(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${timeString}</span>
            </div>
        `;
        
        return messageDiv;
    }

    generateResponse(userMessage) {
        const responses = {
            'course': [
                "We offer a wide range of courses including Safety Training, Leadership Development, and Skills Development programs. Which area interests you most?",
                "Our courses are industry-certified and available both online and in-person. Would you like me to send you our course catalog?",
                "We have courses starting every month. What type of training are you looking for?"
            ],
            'learnership': [
                "Great! Our learnership programs are designed to provide practical skills and qualifications. We have programs in various sectors including Business, Technology, and Management.",
                "Our learnership programs combine theoretical learning with practical work experience. Would you like to know about specific requirements?",
                "We're currently accepting applications for our 2024 learnership programs. I can help you with the application process!"
            ],
            'pricing': [
                "Our course prices vary depending on the program and duration. We also offer group discounts and corporate packages. Which course are you interested in?",
                "We have flexible payment options available. Would you like me to send you a detailed quote for specific courses?",
                "Pricing depends on the course type and delivery method. I can provide you with a customized quote. What's your training budget?"
            ],
            'default': [
                "Thank you for your message! I'm here to help with any questions about our training programs.",
                "That's a great question! Let me connect you with one of our training specialists who can provide detailed information.",
                "I'd be happy to help you with that. Can you tell me more about what you're looking for?",
                "Thanks for reaching out! Our team will get back to you shortly with more information.",
                "I understand you're interested in our services. Would you like to schedule a consultation call?"
            ]
        };

        const lowerMessage = userMessage.toLowerCase();
        let responseArray = responses.default;

        if (lowerMessage.includes('course') || lowerMessage.includes('training') || lowerMessage.includes('program')) {
            responseArray = responses.course;
        } else if (lowerMessage.includes('learnership') || lowerMessage.includes('apply')) {
            responseArray = responses.learnership;
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
            responseArray = responses.pricing;
        }

        return responseArray[Math.floor(Math.random() * responseArray.length)];
    }

    handleQuickReply(message) {
        // Hide quick replies after use
        const quickRepliesContainer = document.querySelector('.quick-replies');
        quickRepliesContainer.style.display = 'none';
        
        // Generate appropriate response
        setTimeout(() => {
            this.sendAgentResponse(message);
        }, 800);
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showInitialNotification() {
        setTimeout(() => {
            this.chatNotification.style.display = 'flex';
        }, 3000);
    }

    hideNotification() {
        this.chatNotification.style.display = 'none';
    }
}

// Initialize chat widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
});