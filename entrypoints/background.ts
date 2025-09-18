import { browser } from "wxt/browser";
import { SidepanelMessage } from "./type";
import axios from "axios";
import { User } from "@/lib/type";

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
      console.log("MESSAGE", message);

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
      };

      handleMessage().then(sendResponse);
      return true; // Keep the message channel open for async response
    }
  );
});
