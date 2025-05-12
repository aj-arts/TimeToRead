# Privacy Policy for Time to Read Chrome Extension

**Last Updated:** May 12, 2025

Thank you for using the Time to Read Chrome Extension (the "Extension"). This privacy policy explains how the Extension handles information.

## Information We Do Not Collect

We take your privacy seriously. The Time to Read extension is designed to function entirely locally on your browser.

* **No Personal Data:** The Extension does not collect, store, transmit, or share any personally identifiable information about you.
* **No Browse Activity:** The Extension does not track your Browse history or collect data about the websites you visit, beyond the temporary, local access needed for its core function.
* **No Data Transmission:** All calculations and operations performed by the Extension happen within your browser. No data about the page content or your usage is sent to any external servers or third parties.

## How the Extension Works

1.  **Reading Page Content:** To calculate the estimated reading time, the Extension needs to access the text content (`innerText`) of the web page you are currently viewing. This access happens locally within your browser and the content is only used for the immediate calculation. The page content is **not** stored or transmitted anywhere.
2.  **Accessing Tab Information:** The Extension uses the `tabs` permission to know when you switch tabs or when a page finishes loading, so it can trigger the reading time calculation. It also checks the URL of the current tab locally to prevent running on certain pages (like Google search results). This URL information is **not** stored or transmitted.

## Permissions Used

* **`tabs`:** Required to detect tab activation and updates, allowing the extension to run automatically on the active page and to get the tab's URL for local checks.
* **Host Permissions (`http://*/*`, `https://*/*`):** Required to inject the content script (`content.js`) into web pages. This script needs to read the page's text and display the reading time overlay directly on the page. This access is solely for the core functionality described above.

## Changes to This Privacy Policy

We may update this Privacy Policy in the future if the Extension's functionality changes. We will notify users of any significant changes by updating the "Last Updated" date at the top of this policy.

## Contact Us

If you have any questions about this Privacy Policy, please contact us at:

Ajinkya Gokule
ajinkyagokule@gmail.com
