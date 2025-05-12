document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript(
      {
        target: {tabId: tabs[0].id},
        files: ['content.js']
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          document.getElementById('readingTime').textContent = 'Error injecting script.';
          return;
        }
        // After script injection, send a message to content.js to get the reading time
        chrome.tabs.sendMessage(tabs[0].id, {action: "getReadingTime"}, function(response) {
          if (chrome.runtime.lastError) {
            // Handle error, e.g., if content script is not there or doesn't respond
            console.error(chrome.runtime.lastError.message);
            document.getElementById('readingTime').textContent = 'Could not get reading time.';
            return;
          }
          if (response && response.readingTime) {
            document.getElementById('readingTime').textContent = response.readingTime;
          } else {
            document.getElementById('readingTime').textContent = 'Could not calculate.';
          }
        });
      }
    );
  });
});
