declare namespace YaSDK {
    interface InitOptions {
        adv: {
            onAdvClose: (wasShown: boolean) => void;
        }

        screen: {
            fullscreen?: boolean;
            orientation?: {
                value: 'portrait' | 'landscape';
                lock?: boolean;
            }
        }
    }

    interface AdsRequest {
        callbacks: {
            onClose?: (wasShown?: boolean) => void;
            onOpen?: () => void;
            onError?: (e: Error) => void;
            onRewarded?: () => void;
            onOffline?: () => void;
        }
    }

    interface Player {
        setData (data: Record<string, any>, flush?: boolean): Promise<void>;
        getData (): Promise<void>; //<T extends any> (keys?: string[]): Promise<T>;
        setStats (data: Record<string, number>): Promise<void>;
        incrementStats (increments: Record<string, number>): Promise<Record<string, number>>;
        getUniqueID (): string;
        getIDsPerGame (): Promise<string[]>;
        getName (): string;
        getMode (): string;
        getPhoto (size: 'small' | 'medium' | 'large'): string;
    }

    interface Purchase {
        readonly productID: string;
        readonly purchaseToken: string;
        readonly developerPayload: string;
        readonly signature: string;
    }

    interface Product {
        readonly id: string;
        readonly title : string;
        readonly description : string;
        readonly imageURI: string;
        readonly price: string;
        readonly priceCurrencyCode: string;
    }

    interface Payments {
        purchase (payload: { id: string, developerPayload?: string }): Promise<Purchase>;
        getPurchases (options: {signed?: boolean}): Promise<Purchase[]>;
        getCatalog (): Promise<Product[]>;
        consumePurchase (purchaseToken: string): Promise<void>;
    }

    enum ESdkEventName {
        EXIT = 'EXIT',
        HISTORY_BACK = 'HISTORY_BACK'
    }

    interface LeaderBoardEntriesResponse {
      ranges: [
        {
          start: number,
          size: number
        }
      ],
      userRank: number,
      entries: LeaderBoardEntre[],
    }

    interface LeaderBoardEntre {
      score: number,
      extraData: string,
      rank: number,
      player: {
        getAvatarSrc: (size?: string) => string,
        getAvatarSrcSet: (size?: string) => string,
        lang: string,
        publicName: string,
        scopePermissions: {
          avatar: string,
          public_name: string
        },
        uniqueID: string,
      }
      formattedScore: string,
    }

    interface LeaderBoard {
      setLeaderboardScore(leaderBoard: string, score: number): Promise<void>,
      getLeaderboardEntries(leaderBoard: string, params?: {
        quantityTop?: number,
        includeUser?: boolean,
        quantityAround?: number,
      }): Promise<LeaderBoardEntriesResponse>,
      getLeaderboardPlayerEntry(leaderBoard: string): Promise<LeaderBoardEntre>;
    }

    interface Api {
        readonly adv: {
            showFullscreenAdv (config: AdsRequest): void;
            showRewardedVideo (config: AdsRequest): void;
        }

        readonly auth: {
            openAuthDialog (): Promise<void>;
        }

        readonly feedback: {
            canReview (): Promise<{ value: boolean }>;
            requestReview (): Promise<{ feedbackSent: boolean }>;
        }

        getLeaderboards (): Promise<LeaderBoard>

        getPlayer (options?: { scopes?: boolean, signed?: boolean }): Promise<Player>;
        getPayments (options?: { scopes?: boolean, signed?: boolean }): Promise<Payments>;

        EVENTS: {
            EXIT: ESdkEventName.EXIT,
            HISTORY_BACK: ESdkEventName.HISTORY_BACK
        },
        dispatchEvent(eventName: ESdkEventName, detail?: any): Promise<unknown>;
        onEvent(eventName: ESdkEventName, listener: (...args:any[]) => any): () => void;
    }

    interface YaGames {
        init (payload?: InitOptions): Promise<Api>;
    }

}