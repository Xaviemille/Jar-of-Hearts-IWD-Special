// Replace this with your actual Web App URL from the Apps Script deployment
const API_URL = 'https://script.google.com/macros/s/AKfycby8OSiPVY8bgBrnvAONMoGIKr9QmySejnIkDwjfkDqCBeWMicZ2liZ5BsqCEQDAlhsk/exec';

document.addEventListener('DOMContentLoaded', () => {

  // Fetch messages from the Google Sheet via the Apps Script GET endpoint
  async function fetchMessages() {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycby8OSiPVY8bgBrnvAONMoGIKr9QmySejnIkDwjfkDqCBeWMicZ2liZ5BsqCEQDAlhsk/exec');
      const messages = await response.json();
      console.log("Fetched messages:", messages);
      renderMessages(messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }

  // Render messages into the home screen message container.
  // Assumes each message object has keys: date, message, name, likes.
  function renderMessages(messages) {
    // Sort messages by date descending (newest first)
    messages.sort((a, b) => new Date(b.date) - new Date(a.date));
    const container = document.getElementById('messageContainer');
    container.innerHTML = messages.map((msg, index) => {
      return `
      <div class="relative w-full aspect-square">
        <div class="absolute inset-0 transform hover:-translate-y-1 transition-transform animate__animated animate__fadeIn">
          <div class="message-heart h-full">
            <div class="absolute inset-0 flex flex-col p-6 z-10">
              <div class="flex items-center mb-2">
                <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <i class="ri-user-smile-line text-lg"></i>
                </div>
                <div class="ml-2">
                  <h4 class="font-semibold text-sm">${msg.name}</h4>
                </div>
              </div>
              <p class="text-gray-600 text-sm flex-grow overflow-y-auto">${msg.message}</p>
              <div class="flex items-center justify-between mt-2">
                <!-- The like button uses the row number (assumes header is row 1) -->
                <button onclick="likeMessage(${index + 2})" class="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors cursor-pointer">
                  <i class="ri-heart-line"></i>
                  <span class="text-sm">${msg.likes}</span>
                </button>
                <span class="text-xs text-gray-400">${new Date(msg.date).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
    }).join('');
  }

  // Post a new message using a POST request.
  // It sends URL-encoded form data with two parameters: "Message" and "Name".
  async function addMessage() {
    const messageInput = document.getElementById('messageInput');
    const authorInput = document.getElementById('authorInput');
    const messageText = messageInput.value.trim();
    if (!messageText) return;

    // Create URL-encoded form data
    const formData = new URLSearchParams();
    formData.append('Message', messageText);
    formData.append('Name', authorInput.value.trim() || "Anonymous");

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycby8OSiPVY8bgBrnvAONMoGIKr9QmySejnIkDwjfkDqCBeWMicZ2liZ5BsqCEQDAlhsk/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formData.toString()
      });
      const result = await response.json();
      console.log("POST result:", result);
      if (result.result === "success") {
        // Clear form inputs
        messageInput.value = '';
        authorInput.value = '';
        // Refresh the list of messages on the home screen
        fetchMessages();
        // Optional GSAP animation for the newly added message
        gsap.from("#messageContainer > div:first-child", {
          duration: 0.5,
          y: -50,
          opacity: 0,
          ease: "back.out"
        });
      } else {
        console.error("Error adding message:", result.error);
      }
    } catch (err) {
      console.error("Error in addMessage:", err);
    }
  }

  // A placeholder for like functionality.
  // To implement persistent like updates, you would need to call your doPut endpoint.
  function likeMessage(row) {
    console.warn("likeMessage function is not implemented in this example.");
  }

  // Function to toggle between sections (e.g., home and share)
  function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('hidden');
    });
    const activeSection = document.getElementById(sectionId + "Section");
    if (activeSection) {
      activeSection.classList.remove('hidden');
    }
    // Update navigation button states
    document.getElementById('homeBtn').classList.remove('text-primary');
    document.getElementById('shareBtn').classList.remove('text-primary');
    document.getElementById(sectionId + "Btn").classList.add('text-primary');
    // Optionally, show or hide the jar image
    const jarImage = document.getElementById('jarImage');
    jarImage.style.visibility = sectionId === 'home' ? 'visible' : 'hidden';
  }

  // Update the countdown timer on the home page
  function updateCountdown() {
    const target = new Date('2025-03-08T00:00:00');
    const now = new Date();
    const diff = target - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
  }

  // Initialize the app
  fetchMessages();
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Initial GSAP animations (if GSAP is included via CDN)
  gsap.from("#homeSection header", {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: "power2.out"
  });
  gsap.from("#countdown > div", {
    duration: 0.8,
    scale: 0,
    opacity: 0,
    stagger: 0.2,
    ease: "back.out(1.7)"
  });

  // Expose functions to the global scope for inline HTML event handlers
  window.showSection = showSection;
  window.addMessage = addMessage;
  window.likeMessage = likeMessage;
});
