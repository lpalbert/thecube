let WebTitles = document.getElementById('web-titles');
let embed = document.getElementById('embed');


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('forwards').addEventListener('click', () => {
        // Generate a random password
        function generatePassword(length) {
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=";
            let password = "";
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }
            return password;
        }

        // Set the password to the 'passwordes' input field
        const passwordInput = document.getElementById('passwordes');
        if (passwordInput) {
            passwordInput.value = generatePassword(8); // Change 8 to your desired password length
        }

        // Inject random password into input fields and text areas
        const inputFields = document.querySelectorAll("input[type='password'], textarea");
        inputFields.forEach((field) => {
            field.value = passwordInput.value;
        });
    });
});

  





document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            const favicon = document.querySelector("link[rel='icon']") || document.querySelector("link[rel='shortcut icon']");
            const title = document.title;
            let description = '';
            const metaTags = document.getElementsByTagName('meta');
            for (let i = 0; i < metaTags.length; i++) {
              if (metaTags[i].getAttribute('name') === 'description') {
                description = metaTags[i].getAttribute('content');
                break;
              }
            }
            const url = window.location.href;
            return { favicon: favicon ? favicon.href : null, title, description, url };
          },
        }, (results) => {
          const { favicon, title, description, url } = results[0].result;
          if (favicon) {
            const faviconImg = document.getElementById('favicon');
            if (faviconImg) {
              faviconImg.src = favicon;
            }
          }
          if (WebTitles) {
            WebTitles.textContent = title || 'No title available';
          }
          const descriptionElement = document.getElementById('description');
          if (descriptionElement) {
            descriptionElement.textContent = description || 'No description available';
          }
          const urlElement = document.getElementById('sitemap-url');
          if (urlElement) {
            urlElement.textContent = url || 'No URL available';
          }
        });
      }
    });
  });
  
   
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.message === "insert_success") {
    // Handle the insert success message
    const password = message.payload.password;
    // Display the password in the extension frontend
    document.getElementById("passwordes").value = password;
    }
})

// Function to request all passwords from background script
function requestAllPasswords() {
    chrome.runtime.sendMessage({ message: "get_all" });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.message === "get_all_success") {
        // Handle the success message and create a downloadable text file
        const passwords = message.payload.passwords;
        if (passwords && passwords.length > 0) {
            // Concatenate all passwords into a single string
            const allPasswords = passwords.join("\n");

            // Create a Blob containing all passwords
            const blob = new Blob([allPasswords], { type: "text/plain" });

            // Create a temporary URL for the Blob
            const url = URL.createObjectURL(blob);

            // Create a link element to trigger the download
            const link = document.createElement("a");
            link.href = url;
            link.download = "passwords.txt";

            // Trigger the download
            document.body.appendChild(link);
            link.click();

            // Clean up resources
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } else {
            console.log("No passwords found in the database.");
        }
    }
});

// Request all passwords when the popup is opened
requestAllPasswords();

// Listen for click events on the download button
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("download")) {
        // Request all passwords when the download button is clicked
        requestAllPasswords();
    }
});
