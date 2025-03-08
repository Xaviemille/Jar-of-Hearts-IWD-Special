// Replace the URL below with your actual Web App URL from the Apps Script deployment
const API_URL = 'https://script.google.com/macros/s/AKfycbxkRoQT1vN4P-HI4e0aGh8t8855gZTXOBneatpl9Co-UIOKEvDVbZ5AoSe_dUpE_rhl/exec';

document.addEventListener("DOMContentLoaded", function() {

  async function fetchMessages() {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxkRoQT1vN4P-HI4e0aGh8t8855gZTXOBneatpl9Co-UIOKEvDVbZ5AoSe_dUpE_rhl/exec');
      const messages = await response.json();
      renderMessages(messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }

  function renderMessages(messages) {
    // Sort messages by likes (or by another criterion, e.g., timestamp)
    messages.sort((a, b) => b.likes - a.likes);
    const container = document.getElementById('messageContainer');
    container.innerHTML = messages.map(msg => {
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
                <button onclick="likeMessage(${msg.id})" class="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors cursor-pointer">
                  <i class="ri-heart-line"></i>
                  <span class="text-sm">${msg.likes}</span>
                </button>
                <span class="text-xs text-gray-400">${new Date(msg.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
    }).join('');
  }

  async function addMessage() {
    const messageInput = document.getElementById('messageInput');
    const authorInput = document.getElementById('authorInput');
    const messageText = messageInput.value.trim();
    if (!messageText) return;
    
  const payload = {
  name: document.getElementById('authorInput').value.trim() || "Anonymous",
  message: document.getElementById('messageInput').value.trim()
};

    
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxkRoQT1vN4P-HI4e0aGh8t8855gZTXOBneatpl9Co-UIOKEvDVbZ5AoSe_dUpE_rhl/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.result === "success") {
        // Clear the form fields
        messageInput.value = '';
        authorInput.value = '';
        // Refresh messages on the home screen
        fetchMessages();
        // Optional: animate the newly added message
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

  // Placeholder: likeMessage currently only logs a warning.
  // To persist likes, you would need to implement an endpoint in your Apps Script.
  function likeMessage(id) {
    console.warn("likeMessage functionality is not implemented for persistence.");
  }

  function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('hidden');
    });
    const activeSection = document.getElementById(sectionId + "Section");
    if (activeSection) {
      activeSection.classList.remove('hidden');
    }
    // Update button states
    document.getElementById('homeBtn').classList.remove('text-primary');
    document.getElementById('shareBtn').classList.remove('text-primary');
    document.getElementById(sectionId + "Btn").classList.add('text-primary');
    // Show or hide the jar image based on the active section
    const jarImage = document.getElementById('jarImage');
    jarImage.style.visibility = sectionId === 'home' ? 'visible' : 'hidden';
  }

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

  // Initial GSAP animations
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
  document.querySelectorAll('.section').forEach(section => {
    section.addEventListener('show', () => {
      gsap.from(section.children, {
        duration: 0.5,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
      });
    });
  });

  // Expose functions to the global scope for inline event handlers
  window.showSection = showSection;
  window.addMessage = addMessage;
  window.likeMessage = likeMessage;

});
