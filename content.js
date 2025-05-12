// content.js
console.log("[ContentScript] Loaded and listening.");

const WORDS_PER_MINUTE = 200; // Average reading speed
const UI_DISPLAY_ID = 'time-to-read-page-display';
const UI_FADE_OUT_DELAY_MS = 5000; // Display UI for 5 seconds
const UI_FADE_TRANSITION_MS = 500; // Duration of fade in/out animation

/**
 * Calculates the estimated reading time for the page content.
 * @returns {string} A string representing the estimated reading time (e.g., "5 min read").
 */
function calculateReadingTime() {
  if (!document.body) {
    console.warn("[ContentScript] Document body not available for reading time calculation.");
    return "N/A";
  }
  const textContent = document.body.innerText || ""; // Fallback to empty string if innerText is null/undefined
  const words = textContent.trim().split(/\s+/).filter(Boolean).length; // Filter out empty strings from split
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);
  const timeString = `${minutes} min read`;
  console.log("[ContentScript] Calculated reading time:", timeString, "(words:", words, ")");
  return timeString;
}

/**
 * Creates or updates and displays a UI element on the page with the reading time.
 * @param {string} readingTimeText The text to display (e.g., "5 min read").
 */
function displayTimeOnPageUI(readingTimeText) {
  console.log("[ContentScript] Attempting to display UI with text:", readingTimeText);
  let displayElement = document.getElementById(UI_DISPLAY_ID);

  if (!displayElement) {
    displayElement = document.createElement('div');
    displayElement.id = UI_DISPLAY_ID;
    Object.assign(displayElement.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Slightly more opaque
      color: 'white',
      padding: '10px 15px', // Slightly more padding
      borderRadius: '6px', // Slightly smaller radius
      fontSize: '14px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      zIndex: '2147483647', // Max z-index to try to be on top
      boxShadow: '0 3px 12px rgba(0,0,0,0.25)', // Adjusted shadow
      opacity: '0',
      transition: `opacity ${UI_FADE_TRANSITION_MS}ms ease-in-out`,
      pointerEvents: 'none',
      lineHeight: '1.4' // Added for better text readability
    });
    document.body.appendChild(displayElement);
    console.log("[ContentScript] UI element created and appended.");

    // Trigger fade-in after a very short delay to ensure transition applies
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { // Double requestAnimationFrame for more reliable transition start
        displayElement.style.opacity = '1';
      });
    });

  } else {
    // If element exists, ensure it's visible (in case it was hidden or is being updated)
    displayElement.style.opacity = '1';
  }

  displayElement.textContent = readingTimeText;
  console.log("[ContentScript] UI text content set.");

  // Clear any existing fade-out timer to prevent premature fade if triggered again quickly
  if (displayElement.fadeOutTimer) {
    clearTimeout(displayElement.fadeOutTimer);
  }

  // Hide the display after a delay
  displayElement.fadeOutTimer = setTimeout(() => {
    displayElement.style.opacity = '0';
    // Optional: remove the element after fade out to keep DOM clean, but can cause issues if rapidly re-triggered.
    // For simplicity and robustness against rapid triggers, we'll leave it in the DOM and just hide it.
    // setTimeout(() => { if(displayElement.parentNode) displayElement.parentNode.removeChild(displayElement); }, UI_FADE_TRANSITION_MS);
  }, UI_FADE_OUT_DELAY_MS);
}

// --- Event Listener ---

/**
 * Listener for messages from the service worker or popup.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[ContentScript] Message received:", request);
  if (request.action === "displayReadingTimeOnPage") {
    const readingTime = calculateReadingTime();
    displayTimeOnPageUI(readingTime);
    sendResponse({status: "Reading time UI triggered", time: readingTime});
  } else {
    // Handle other actions if any in the future, or log unknown action
    console.warn("[ContentScript] Unknown action received:", request.action);
    sendResponse({status: "Unknown action"});
  }
  return true; // Required for asynchronous sendResponse
});
