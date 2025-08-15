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

  // Handle hash changes instead of browser back/forward buttons
  window.addEventListener("hashchange", handleHashChange);

  // Handle fullscreen change events
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("mozfullscreenchange", handleFullscreenChange);
  document.addEventListener("MSFullscreenChange", handleFullscreenChange);

  // Check initial hash on page load
  handleHashChange();
}

// Navigation functions
function navigateToRoom(roomSlug) {
  const roomConfig = roomConfigs[roomSlug];
  if (!roomConfig) {
    console.error("Room not found:", roomSlug);
    return;
  }

  currentRoom = roomSlug;

  // Update URL hash instead of browser history
  window.location.hash = `#${roomSlug}`;

  // Show room page
  showRoomPage(roomConfig);
}

function goHome() {
  currentRoom = null;

  // Update URL hash to root
  window.location.hash = "";

  // Show home page
  showHomePage();
}

// Handle hash changes
function handleHashChange() {
  const hash = window.location.hash.substring(1); // Remove leading #

  if (hash && roomConfigs[hash]) {
    // Show specific room
    currentRoom = hash;
    showRoomPage(roomConfigs[hash]);
  } else {
    // Show home page
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

  // Try to use the Fullscreen API first
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    // Exit fullscreen if already in fullscreen
    exitFullscreen();
    return;
  }

  // Create fullscreen overlay container
  const fullscreenContainer = document.createElement("div");
  fullscreenContainer.id = "fullscreen-container";
  fullscreenContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: white;
    z-index: 9999;
    display: flex;
    flex-direction: column;
  `;

  // Create header with room title and close button
  const header = document.createElement("div");
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    min-height: 60px;
  `;

  const title = document.createElement("h2");
  title.textContent = roomConfig.title;
  title.style.cssText = `
    margin: 0;
    color: #333;
    font-size: 1.5rem;
    font-weight: bold;
  `;

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "✕ Close Fullscreen";
  closeBtn.style.cssText = `
    padding: 10px 20px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s ease;
  `;

  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.backgroundColor = "#c82333";
  });

  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.backgroundColor = "#dc3545";
  });

  // Create fullscreen iframe
  const fullscreenIframe = document.createElement("iframe");
  fullscreenIframe.src = buildCalendarUrl(roomConfig);
  fullscreenIframe.style.cssText = `
    flex: 1;
    border: none;
    width: 100%;
    height: 100%;
    background: white;
  `;

  // Add event listeners
  closeBtn.addEventListener("click", () => {
    exitFullscreen();
  });

  // Keyboard shortcut to exit fullscreen (Escape key)
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      exitFullscreen();
    }
  };

  // Add to DOM
  header.appendChild(title);
  header.appendChild(closeBtn);
  fullscreenContainer.appendChild(header);
  fullscreenContainer.appendChild(fullscreenIframe);
  document.body.appendChild(fullscreenContainer);

  // Add keyboard event listener
  document.addEventListener("keydown", handleKeyDown);

  // Focus on iframe
  fullscreenIframe.focus();

  // Try to enter fullscreen mode
  enterFullscreen(fullscreenContainer);

  // Store reference for cleanup
  window.currentFullscreenContainer = fullscreenContainer;
  window.currentFullscreenKeyHandler = handleKeyDown;
}

// Handle fullscreen change events
function handleFullscreenChange() {
  // If user exits fullscreen using browser controls, clean up our overlay
  if (
    !document.fullscreenElement &&
    !document.webkitFullscreenElement &&
    !document.mozFullScreenElement &&
    !document.msFullscreenElement
  ) {
    if (window.currentFullscreenContainer) {
      exitFullscreen();
    }
  }
}

// Enter fullscreen function
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen().catch((err) => {
      console.log("Fullscreen API not supported or permission denied:", err);
      showFullscreenFallback();
    });
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen().catch((err) => {
      console.log(
        "Webkit Fullscreen API not supported or permission denied:",
        err
      );
      showFullscreenFallback();
    });
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen().catch((err) => {
      console.log(
        "Mozilla Fullscreen API not supported or permission denied:",
        err
      );
      showFullscreenFallback();
    });
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen().catch((err) => {
      console.log("MS Fullscreen API not supported or permission denied:", err);
      showFullscreenFallback();
    });
  } else {
    // Browser doesn't support Fullscreen API, show fallback
    showFullscreenFallback();
  }
}

// Show fallback message for unsupported browsers
function showFullscreenFallback() {
  // Create a notification banner
  const banner = document.createElement("div");
  banner.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #17a2b8;
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10001;
    font-size: 14px;
    max-width: 400px;
    text-align: center;
  `;

  banner.innerHTML = `
    <div style="margin-bottom: 8px;">
      <strong>Fullscreen Mode Active</strong>
    </div>
    <div style="font-size: 12px; opacity: 0.9;">
      Press ESC or click the close button to exit
    </div>
  `;

  document.body.appendChild(banner);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (banner.parentNode) {
      banner.parentNode.removeChild(banner);
    }
  }, 5000);

  // Store reference for cleanup
  window.currentFullscreenBanner = banner;
}

// Exit fullscreen function
function exitFullscreen() {
  // Remove fullscreen container
  if (window.currentFullscreenContainer) {
    document.body.removeChild(window.currentFullscreenContainer);
    window.currentFullscreenContainer = null;
  }

  // Remove notification banner
  if (window.currentFullscreenBanner) {
    if (window.currentFullscreenBanner.parentNode) {
      window.currentFullscreenBanner.parentNode.removeChild(
        window.currentFullscreenBanner
      );
    }
    window.currentFullscreenBanner = null;
  }

  // Remove keyboard event listener
  if (window.currentFullscreenKeyHandler) {
    document.removeEventListener("keydown", window.currentFullscreenKeyHandler);
    window.currentFullscreenKeyHandler = null;
  }

  // Exit fullscreen if browser is in fullscreen mode
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
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
