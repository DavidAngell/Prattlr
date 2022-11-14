import { Socket as TempSocket, Server as TempServer } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export type Socket = TempSocket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
export type Server = TempServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
export type UUID = string;
export interface SocketResponse<T> {
	error: boolean,
	errorContent?: string,
	content?: T
}

export interface User {
  id: string;
	accessToken: string;
  name: string;
  pfp: string;
  fromTwitch: boolean;
  fromYoutube: boolean;
  fromPrattlr: boolean;
  isMod: boolean;
  isAdmin: boolean;
}

export interface Message {
  content: string;
  user: User;
  timestamp: string;
}

export interface YouTubeChatMessage {
  kind: string,
  etag: any,
  id: string,
  snippet: {
    type: string,
    liveChatId: string,
    authorChannelId: string,
    publishedAt: any,
    hasDisplayContent: boolean,
    displayMessage: string,
    fanFundingEventDetails: {
      amountMicros: number,
      currency: string,
      amountDisplayString: string,
      userComment: string
    },

    textMessageDetails: {
      messageText: string
    },

    messageDeletedDetails: {
      deletedMessageId: string
    },

    userBannedDetails: {
      bannedUserDetails: {
        channelId: string,
        channelUrl: string,
        displayName: string,
        profileImageUrl: string
      },

      banType: string,
      banDurationSeconds: number
    },
		
    memberMilestoneChatDetails: {
      userComment: string,
      memberMonth: number,
      memberLevelName: string
    },

    newSponsorDetails: {
      memberLevelName: string,
      isUpgrade: boolean
    },

    superChatDetails: {
      amountMicros: number,
      currency: string,
      amountDisplayString: string,
      userComment: string,
      tier: number
    },

    superStickerDetails: {
      superStickerMetadata: {
        stickerId: string,
        altText: string,
        language: string
      },

      amountMicros: number,
      currency: string,
      amountDisplayString: string,
      tier: number
    },

    membershipGiftingDetails: {
      giftMembershipsCount: number,
      giftMembershipsLevelName: string
    },

    giftMembershipReceivedDetails: {
      memberLevelName: string,
      gifterChannelId: string,
      associatedMembershipGiftingMessageId: string
    }
  },

  authorDetails: {
    channelId: string,
    channelUrl: string,
    displayName: string,
    profileImageUrl: string,
    isVerified: boolean,
    isChatOwner: boolean,
    isChatSponsor: boolean,
    isChatModerator: boolean
  }
}