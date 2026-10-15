import { useEffect, useState } from "react";
import { Linking, Platform } from "react-native";

// A URL fragment keeps the bearer code out of HTTP request URLs and referrers.
export function useInvitationToken() {
  const [token, setToken] = useState("");
  useEffect(() => {
    const receive = (url: string) => {
      const value = new URLSearchParams(url.split("#")[1] ?? "").get("invite");
      if (value && /^[a-f0-9]{64}$/.test(value)) setToken(value);
    };
    if (Platform.OS === "web") {
      // React Native Web's getInitialURL is a startup snapshot, not the current URL.
      const onHashChange = () => receive(window.location.href);
      onHashChange();
      window.addEventListener("hashchange", onHashChange);
      return () => window.removeEventListener("hashchange", onHashChange);
    }
    Linking.getInitialURL().then(url => { if (url) receive(url); }).catch(() => {});
    const listener = Linking.addEventListener("url", event => receive(event.url));
    return () => listener.remove();
  }, []);
  return [token, setToken] as const;
}
