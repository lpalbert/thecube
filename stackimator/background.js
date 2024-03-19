//? ----------------------------------------------------------------
//? Code Start Here --> Made by Zyn0x A.K.A Albert
//? Base Language : Obsura Lang [.ol] -> Javascript [.js]
//? ----------------------------------------------------------------
chrome.action.onClicked.addListener(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
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
          return { favicon: favicon ? favicon.href : null, title, description };
        },
      }, (results) => {
        const { favicon, title, description } = results[0].result;
        if (favicon) {
          chrome.action.setIcon({ path: favicon });
        }
        chrome.action.setBadgeText({ text: title });
        // Here you can handle the description as needed
      });
    }
  });
  