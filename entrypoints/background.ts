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
            const user = await axios
              .post(`${import.meta.env.WXT_API_URL}/register-insecure`)
              .then(
                (res) =>
                  res.data as {
                    user_id: string;
                    name: string;
                  }
              )
              .then((d) => ({
                displayName: d.name,
                id: d.user_id,
              }));
            await browser.storage.local.set({
              user,
            });
            return user;
          } catch (error: unknown) {
            console.error("Error getting user:", error);
          }
        }

        if (message.type === "GET_USER") {
          const userStorage = await browser.storage.local
            .get("user")
            .then((res) => res as User | null);
          if (!userStorage) {
            return null;
          }
          const userApi = await axios
            .get(`${import.meta.env.WXT_API_URL}/user/${userStorage.id}`)
            .then(
              (res) =>
                res.data as {
                  user_id: string;
                  name: string;
                }
            )
            .catch(() => null);
          return userApi
            ? {
                displayName: userApi.name,
                id: userApi.user_id,
              }
            : null;
        }
      };

      handleMessage().then(sendResponse);
      return true; // Keep the message channel open for async response
    }
  );
});
