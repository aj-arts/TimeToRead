/**
 * Checks if the given URL is a Google search results page.
 * @param {string} url The URL to check.
 * @returns {boolean} True if the URL is a Google search page, false otherwise.
 */
function isGoogleSearchPage(url) {
  if (!url) return false;
  try {
    const parsedUrl = new URL(url);
    // Check for various Google domains and common search paths/query parameters
    // Covers www.google.com, www.google.co.uk, etc.
    if (parsedUrl.hostname.startsWith('www.google.') &&
        (parsedUrl.pathname === '/search' || parsedUrl.searchParams.has('q'))) {
      return true;
    }
  } catch (e) {
    console.warn('[ServiceWorker] Could not parse URL for Google search check:', url, e);
  }
  return false;
}

/**
 * Attempts to inject the content script and send a message to display the reading time UI.
 * @param {number} tabId The ID of the tab to operate on.
 */
function triggerReadingTimeCalculation(tabId) {
  console.log(`[ServiceWorker] Attempting to trigger reading time calculation for tab: ${tabId} by sending message.`);
  // Content script is expected to be injected by manifest's content_scripts declaration.
  chrome.tabs.sendMessage(tabId, { action: "displayReadingTimeOnPage" }, response => {
    if (chrome.runtime.lastError) {
      // Handle cases where the content script might not be ready or listening,
      // or if the tab cannot be messaged (e.g., chrome:// pages, file:// URLs without permission).
      console.warn(`[ServiceWorker] Error sending message to tab ${tabId}: ${chrome.runtime.lastError.message}. Content script might not be active/listening, or page is restricted.`);
    } else {
      // Optional: log success if a response is configured and received.
      // content.js currently returns true from its listener, which might manifest as an undefined response here
      // if no specific data is sent back via sendResponse.
      console.log(`[ServiceWorker] Message sent to tab ${tabId}. Response (if any):`, response);
    }
  });
}

/**
 * Handles the logic for deciding whether to show the reading time UI.
 * Checks if the tab URL is valid and not a Google search page.
 * @param {chrome.tabs.Tab} tab The tab object.
 */
function processTabForReadingTime(tab) {
  if (tab && tab.id && tab.url && (tab.url.startsWith('http:') || tab.url.startsWith('https:'))) {
    if (!isGoogleSearchPage(tab.url)) {
      triggerReadingTimeCalculation(tab.id);
    } else {
      console.log(`[ServiceWorker] URL is a Google search page (${tab.url}), not showing UI for tab ${tab.id}.`);
    }
  } else if (tab) {
    console.log(`[ServiceWorker] Tab ${tab.id} URL is not http/https or invalid (${tab.url}), not showing UI.`);
  }
}

// --- Event Listeners ---

/**
 * Listener for when the extension icon is clicked.
 */
chrome.action.onClicked.addListener((tab) => {
  console.log(`[ServiceWorker] Extension icon clicked for tab: ${tab.id}`);
  processTabForReadingTime(tab);
});

/**
 * Listener for when a tab is activated (switched to).
 */
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (chrome.runtime.lastError) {
      console.error("[ServiceWorker] Error getting tab info in onActivated:", chrome.runtime.lastError.message);
      return;
    }
    console.log(`[ServiceWorker] Tab ${activeInfo.tabId} activated.`);
    processTabForReadingTime(tab);
  });
});

/**
 * Listener for when a tab is updated (e.g., page loaded or reloaded).
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    console.log(`[ServiceWorker] Tab ${tabId} updated and is active, status complete.`);
    processTabForReadingTime(tab);
  }
});
