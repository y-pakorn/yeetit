import { BackgroundMessage } from "@/entrypoints/type";
import { getCleanUrl } from "@/lib/url";
import { useEffect, useState } from "react";

export const useCurrentTab = () => {
  const [currentTab, setCurrentTab] = useState<{
    cleanedUrl: string;
    url: string;
    title: string;
  } | null>(null);

  // Get initial active tab
  useEffect(() => {
    browser.runtime
      .sendMessage({
        type: "GET_ACTIVE_TAB",
      })
      .then((url) => {
        if (url)
          setCurrentTab({
            cleanedUrl: getCleanUrl(url.url),
            url: url.url,
            title: url.title,
          });
      });
  }, []);

  // Listen for tab changes from background script
  useEffect(() => {
    const handleMessage = (message: BackgroundMessage) => {
      if (message.type === "TAB_CHANGED" || message.type === "TAB_UPDATED") {
        setCurrentTab({
          cleanedUrl: getCleanUrl(message.url),
          url: message.url,
          title: message.title,
        });
      } else if (message.type === "PAGE_REFRESHED") {
        setCurrentTab({
          cleanedUrl: getCleanUrl(message.url),
          url: message.url,
          title: message.title,
        });
        console.log("PAGE_REFRESHED");
      }
    };

    browser.runtime.onMessage.addListener(handleMessage);

    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return currentTab;
};
