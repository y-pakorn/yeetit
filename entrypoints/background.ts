import { browser } from "wxt/browser";
import { SidepanelMessage } from "./type";
import axios from "axios";

export default defineBackground(() => {
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: any) => console.error(error));

  // Listen for tab activation changes
  browser.tabs.onActivated.addListener(async (activeInfo) => {
    try {
      const tab = await browser.tabs.get(activeInfo.tabId);

      // Send message to sidepanel about tab change
      browser.runtime.sendMessage({
        type: "TAB_CHANGED",
        url: tab.url,
        title: tab.title,
      });
    } catch (error) {
      console.error("Error getting tab info:", error);
    }
  });

  // Listen for tab updates (URL changes, page loads)
  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "loading" && tab.active) {
      // Send message to sidepanel about page refresh
      browser.runtime.sendMessage({
        type: "PAGE_REFRESHED",
        url: tab.url,
        title: tab.title,
      });
    } else if (changeInfo.status === "complete" && tab.active) {
      // Send message to sidepanel about tab update
      browser.runtime.sendMessage({
        type: "TAB_UPDATED",
        url: tab.url,
        title: tab.title,
      });
    }
  });

  // Listen for messages from sidepanel
  browser.runtime.onMessage.addListener(
    (message: SidepanelMessage, _sender, sendResponse) => {
      const handleMessage = async () => {
        if (message.type === "GET_ACTIVE_TAB") {
          try {
            const [activeTab] = await browser.tabs.query({
              active: true,
              currentWindow: true,
            });
            return {
              title: activeTab.title,
              url: activeTab.url,
            };
          } catch (error: unknown) {
            console.error("Error getting active tab:", error);
          }
        }

        if (message.type === "REGISTER_USER") {
          try {
            const name = await axios
              .get(`${import.meta.env.WXT_API_URL}/generate-name`)
              .then((res) => res.data.name as string);
            const userId = await axios
              .post(`${import.meta.env.WXT_API_URL}/register-insecure`, {
                username: name,
              })
              .then((res) => res.data.user_id as string);
            await browser.storage.local.set({
              user: {
                displayName: name,
                id: userId,
              },
            });
            return { displayName: name, id: userId };
          } catch (error: unknown) {
            console.error("Error getting user:", error);
          }
        }

        if (message.type === "GET_USER") {
          const resp = await browser.storage.local
            .get("user")
            .then((res) => res);
          return resp.user || null;
        }
      };

      handleMessage().then(sendResponse);
      return true; // Keep the message channel open for async response
    }
  );
});
