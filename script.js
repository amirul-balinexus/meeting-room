// Room configurations (same as React version)
const roomConfigs = {
  "agung-room": {
    title: "1st Floor - Agung Room",
    description: "Main meeting room on the first floor",
    calendarId:
      "Y18xODhhNGY2cXA1ZnBxajJiaWYwaDk0Y3N0cDI0OEByZXNvdXJjZS5nb29nbGUuY29t",
    color: "%239e69af",
    buttonColor: "agung",
  },
  "bali-room": {
    title: "2nd Floor - Bali Room",
    description: "Conference room on the second floor",
    calendarId:
      "Y18xODhhNGY2cXA1ZnBxajJiaWYwaDk0Y3N0cDI0OEByZXNvdXJjZS5nb29nbGUuY29t",
    color: "%23B71C1C",
    buttonColor: "bali",
  },
  "java-room": {
    title: "3rd Floor - Java Room",
    description: "Meeting space on the third floor",
    calendarId:
      "Y18xODhhNGY2cXA1ZnBxajJiaWYwaDk0Y3N0cDI0OEByZXNvdXJjZS5nb29nbGUuY29t",
    color: "%234CAF50",
    buttonColor: "java",
  },
};

// DOM elements
const homePage = document.getElementById("home-page");
const roomPage = document.getElementById("room-page");
const roomTitle = document.getElementById("room-title");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const backBtn = document.getElementById("back-btn");
const calendarIframe = document.getElementById("calendar-iframe");
const roomsGrid = document.getElementById("rooms-grid");

// Current room state
let currentRoom = null;
let refreshInterval = null;

// Generate room cards HTML
function generateRoomCards() {
  const roomCardsHTML = Object.entries(roomConfigs)
    .map(([slug, config]) => {
      return `
        <div class="room-card" data-room="${slug}">
          <div class="room-color ${config.buttonColor}"></div>
          <div class="room-content">
            <h3>${config.title}</h3>
            <p>${config.description}</p>
            <div class="view-calendar">
              <span>View Calendar</span>
              <svg class="arrow" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  roomsGrid.innerHTML = roomCardsHTML;
}

// Initialize the application
function init() {
  // Generate room cards dynamically
  generateRoomCards();

  // Add event listeners to room cards
  attachRoomCardListeners();

  // Add event listeners to buttons
  fullscreenBtn.addEventListener("click", toggleFullscreen);
  backBtn.addEventListener("click", goHome);

  // Handle browser back/forward buttons
  window.addEventListener("popstate", handlePopState);

  // Check if we should show a specific room (for direct URL access)
  const path = window.location.pathname;
  if (path !== "/" && path !== "") {
    const roomSlug = path.substring(1); // Remove leading slash
    if (roomConfigs[roomSlug]) {
      navigateToRoom(roomSlug);
    }
  }
}

// Navigation functions
function navigateToRoom(roomSlug) {
  const roomConfig = roomConfigs[roomSlug];
  if (!roomConfig) {
    console.error("Room not found:", roomSlug);
    return;
  }

  currentRoom = roomSlug;

  // Update browser history
  window.history.pushState({ room: roomSlug }, "", `/${roomSlug}`);

  // Show room page
  showRoomPage(roomConfig);
}

function goHome() {
  currentRoom = null;

  // Update browser history
  window.history.pushState({}, "", "/");

  // Show home page
  showHomePage();
}

function handlePopState(event) {
  if (event.state && event.state.room) {
    const roomConfig = roomConfigs[event.state.room];
    if (roomConfig) {
      currentRoom = event.state.room;
      showRoomPage(roomConfig);
    }
  } else {
    currentRoom = null;
    showHomePage();
  }
}

// Page display functions
function showRoomPage(roomConfig) {
  homePage.classList.remove("active");
  roomPage.classList.add("active");

  // Update room title
  roomTitle.textContent = roomConfig.title;

  // Update fullscreen button color
  fullscreenBtn.className = `fullscreen-btn ${roomConfig.buttonColor}`;

  // Build and set calendar URL
  const calendarUrl = buildCalendarUrl(roomConfig);
  calendarIframe.src = calendarUrl;

  // Start auto-refresh timer
  startAutoRefresh();
}

function showHomePage() {
  roomPage.classList.remove("active");
  homePage.classList.add("active");

  // Stop auto-refresh timer
  stopAutoRefresh();

  // Clear iframe
  calendarIframe.src = "";
}

// Calendar URL builder
function buildCalendarUrl(roomConfig) {
  return `https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Asia%2FMakassar&showPrint=0&mode=WEEK&title=${encodeURIComponent(
    roomConfig.title
  )}&showTabs=0&showCalendars=0&showDate=0&showNav=0&src=${
    roomConfig.calendarId
  }&color=${roomConfig.color}`;
}

// Auto-refresh functionality
function startAutoRefresh() {
  // Clear any existing interval
  stopAutoRefresh();

  // Set new interval (5 minutes = 300000ms)
  refreshInterval = setInterval(() => {
    if (calendarIframe.src) {
      calendarIframe.src = calendarIframe.src;
    }
  }, 300000);
}

function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

// Fullscreen functionality
function toggleFullscreen() {
  if (!currentRoom) return;

  const roomConfig = roomConfigs[currentRoom];
  if (!roomConfig) return;

  // Create fullscreen iframe
  const fullscreenIframe = document.createElement("iframe");
  fullscreenIframe.src = buildCalendarUrl(roomConfig);
  fullscreenIframe.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        border: none;
        z-index: 9999;
        background: white;
    `;

  // Add close button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕ Close Fullscreen";
  closeBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 10px 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    `;

  // Add event listeners
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(fullscreenIframe);
    document.body.removeChild(closeBtn);
  });

  // Add to DOM
  document.body.appendChild(fullscreenIframe);
  document.body.appendChild(closeBtn);

  // Focus on iframe
  fullscreenIframe.focus();
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);

// Export functions for potential external use
window.MeetingRoomApp = {
  navigateToRoom,
  goHome,
  toggleFullscreen,
  addRoom,
  generateRoomCards,
};

// Helper function to add new rooms dynamically
function addRoom(slug, config) {
  if (roomConfigs[slug]) {
    console.warn(
      `Room "${slug}" already exists. Use updateRoom() to modify existing rooms.`
    );
    return false;
  }

  // Validate required config properties
  const requiredProps = [
    "title",
    "description",
    "calendarId",
    "color",
    "buttonColor",
  ];
  const missingProps = requiredProps.filter((prop) => !config[prop]);

  if (missingProps.length > 0) {
    console.error(`Missing required properties: ${missingProps.join(", ")}`);
    return false;
  }

  // Add the new room
  roomConfigs[slug] = config;

  // Regenerate room cards if we're on the home page
  if (homePage.classList.contains("active")) {
    generateRoomCards();
    // Re-attach event listeners
    attachRoomCardListeners();
  }

  return true;
}

// Helper function to update existing rooms
function updateRoom(slug, config) {
  if (!roomConfigs[slug]) {
    console.error(
      `Room "${slug}" does not exist. Use addRoom() to create new rooms.`
    );
    return false;
  }

  // Update the room config
  roomConfigs[slug] = { ...roomConfigs[slug], ...config };

  // Regenerate room cards if we're on the home page
  if (homePage.classList.contains("active")) {
    generateRoomCards();
    // Re-attach event listeners
    attachRoomCardListeners();
  }

  return true;
}

// Helper function to attach event listeners to room cards
function attachRoomCardListeners() {
  const roomCards = document.querySelectorAll(".room-card");
  roomCards.forEach((card) => {
    card.addEventListener("click", () => {
      const roomSlug = card.getAttribute("data-room");
      navigateToRoom(roomSlug);
    });
  });
}
