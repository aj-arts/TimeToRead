# Time to Read Chrome Extension

This Chrome extension estimates the time it will take to read the content of the current web page.

## Features

- Calculates reading time based on an average reading speed of 200 words per minute.
- Displays the estimated reading time as a small, non-intrusive UI element directly on the web page.
- The reading time UI automatically appears when:
    - A new page finishes loading.
    - You switch to a different tab.
    - You click the extension icon in the browser toolbar.
- The UI is designed not to appear on Google search results pages to avoid clutter.
- Built using Manifest V3 practices.

## How to Use

1.  Clone or download this repository.
2.  Open Chrome and navigate to `chrome://extensions`.
3.  Enable "Developer mode" in the top right corner.
4.  Click "Load unpacked".
5.  Select the directory where you cloned/downloaded the extension files.
6.  Navigate to any webpage (that isn't a Google search results page). The reading time should appear automatically in the bottom-right corner. You can also click the extension icon to show it.

## Files

- `manifest.json`: The extension's manifest file (using Manifest V3).
- `service-worker.js`: Handles background tasks like listening to tab events and icon clicks.
- `content.js`: Injected into web pages to calculate reading time and display the on-page UI.
- `images/`: Directory for extension icons (icon16.png, icon48.png, icon128.png).
- `popup.html` & `popup.js`: (Currently unused as the primary functionality has shifted to an on-page UI).
