export enum BackgroundMessageType {
  TAB_CHANGED = "TAB_CHANGED",
  TAB_UPDATED = "TAB_UPDATED",
  PAGE_REFRESHED = "PAGE_REFRESHED",
}

export type BackgroundMessage =
  | {
      type: "TAB_CHANGED";
      url: string;
      title: string;
    }
  | {
      type: "TAB_UPDATED";
      url: string;
      title: string;
    }
  | {
      type: "PAGE_REFRESHED";
      url: string;
      title: string;
    };

export type SidepanelMessage = {
  type: "GET_ACTIVE_TAB";
};

export enum MessageFrom {
  contentScript = "contentScript",
  background = "background",
  popUp = "popUp",
  sidePanel = "sidePanel",
}

class ExtMessage {
  content?: string;
  from?: MessageFrom;

  constructor(messageType: BackgroundMessageType) {
    this.messageType = messageType;
  }

  messageType: BackgroundMessageType;
}

export default ExtMessage;
