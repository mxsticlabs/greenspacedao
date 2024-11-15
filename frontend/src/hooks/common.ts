import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { apiPost } from "src/utils";

import { useAccount, useSignMessage } from "wagmi";

import TurndownService from "turndown";
import { useNextAuthSession } from "src/providers/okto-next-auth";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.log(error);
        return initialValue;
      }
    }
    return initialValue;
  });
  console.log("use Storage " + key);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === key && event.newValue !== null) {
          try {
            setStoredValue(JSON.parse(event.newValue));
          } catch (error) {
            console.log(error);
          }
        }
      };
      window.addEventListener("storage", handleStorageChange);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [key]);

  return [storedValue, setValue] as const;
};

export function useHTMLToMarkdownConverter() {
  const [html, setHtml] = useState("");
  const [markdown, setMarkdown] = useState("");
  const turndownService = new TurndownService();

  // Add rules to handle specific HTML elements or attributes
  turndownService.addRule("heading", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function (content, node, options) {
      const hLevel = +node.nodeName.charAt(1);
      const hPrefix = "#".repeat(hLevel);
      return `\n\n${hPrefix} ${content}\n\n`;
    }
  });

  turndownService.addRule("paragraph", {
    filter: "p",
    replacement: function (content) {
      return `\n\n${content}\n\n`;
    }
  });

  useEffect(() => {
    if (html) {
      setMarkdown(turndownService.turndown(html));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html]);

  const updateHtml = useCallback((newHtml: string) => {
    setHtml(newHtml);
  }, []);

  return { markdown, updateHtml };
}
export const useScrollToBottom = (triggerOnLoad = false) => {
  const chatContainerRef = useRef<any>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (triggerOnLoad) {
      scrollToBottom();
    }
  }, [triggerOnLoad]);

  const scrollToBottomOnNewMessage = () => {
    scrollToBottom();
  };

  return {
    containerRef: chatContainerRef,
    scrollToBottom: scrollToBottomOnNewMessage
  };
};
/**
 * Used to check if the user is logged in
 * @returns
 */
export const useInAppAuth = ({ openModal }: { openModal?: () => void } = {}) => {
  const { status, data: session } = useNextAuthSession();

  function connect() {
    openModal?.();
  }
  useEffect(() => {}, [session?.user, session?.id_token, status]);
  return {
    user: session?.user,
    idToken: session?.id_token,
    connect,
    ready: status !== "loading",
    isLoggedIn: !!session?.user
  };
};

export function useCustomSign() {
  //const { publicKey, signMessage } = useWallet();
  // const { connectAsync } = useConnect();
  const { data, error, signMessageAsync } = useSignMessage({
    mutation: {
      onError(error, variables, context) {},
      onSuccess(data, variables, context) {}
    }
  });

  const { isConnected, address } = useAccount();
  const { chain } = useAccount();

  // const { account, chain } = await connectAsync({
  //   connector: new MetaMaskConnector(),
  // });

  const [signed, setSigned] = useState(false);

  const signCustomMessage = async () => {
    //const address = publicKey?.toBase58();
    //const chain = "solana";

    const account = {
      address: address,
      chainId: chain?.id,
      network: chain?.name
    };
    // const message = "Sign to provide access to app";
    const { message } = await apiPost("api/auth/request-message", account);
    // const encodedMessage = new TextEncoder().encode(message);
    // const signedMessage = signMessage?.(encodedMessage) as unknown;

    const signedMessage = (await signMessageAsync?.({
      message: message
    })) as unknown as any;

    setSigned(true);
    //const signature = base58.encode(signedMessage);
    const signature = signedMessage;
    try {
      // await signIn("credentials", {
      //   message,
      //   signature,
      //   redirect: false,
      // });
    } catch (e) {
      console.log(e);
      return;
    }
  };

  useEffect(() => {
    address ? !signed && signCustomMessage() : setSigned(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return { signed, setSigned, signCustomMessage };
}
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const useActiveTab = (paramName: string = "tab"): [string, (tabName: string) => void] => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const { query } = router;
    const activeTabParam = query[paramName] as string;
    setActiveTab(activeTabParam || ""); // Set active tab from URL query params
  }, [router, paramName]);

  const setActiveTabAndUpdateUrl = (tabName: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, [paramName]: tabName }
      },
      undefined,
      { shallow: true }
    );
    setActiveTab(tabName);
  };

  return [activeTab, setActiveTabAndUpdateUrl];
};

export const useResize = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    //@ts-ignore
    width: undefined,
    //@ts-ignore
    height: undefined
  });
  const isMobileSize = windowSize?.width < 560;
  const isTabletSize = windowSize?.width > 560 && windowSize?.width <= 960;

  useEffect(() => {
    // Function to update window size
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Initial window size update
    updateWindowSize();

    // Event listener to update window size on resize
    window.addEventListener("resize", updateWindowSize);

    // Clean-up function to remove event listener
    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []); // Run only once on component mount

  return { ...windowSize, isMobileSize, isTabletSize };
};
