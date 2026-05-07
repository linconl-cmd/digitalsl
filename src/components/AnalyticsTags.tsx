import { useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";

/**
 * Injects Google Tag Manager, GA4, Google Ads conversion tag and
 * Search Console / generic site verification meta tag into <head>.
 * IDs are configured via the admin panel (site_settings table).
 */
export default function AnalyticsTags() {
  const { data: settings } = useSettings();

  const gtmId = settings?.gtm_container_id?.trim();
  const ga4Id = settings?.ga4_measurement_id?.trim();
  const adsId = settings?.google_ads_conversion_id?.trim();
  const searchConsole = settings?.search_console_verification?.trim();
  const siteVerification = settings?.google_site_verification_meta?.trim();

  useEffect(() => {
    const added: HTMLElement[] = [];

    const addScript = (id: string, content?: string, src?: string, async = true) => {
      if (document.getElementById(id)) return;
      const s = document.createElement("script");
      s.id = id;
      s.async = async;
      if (src) s.src = src;
      if (content) s.innerHTML = content;
      document.head.appendChild(s);
      added.push(s);
    };

    const addMeta = (id: string, name: string, content: string) => {
      if (document.getElementById(id)) return;
      const m = document.createElement("meta");
      m.id = id;
      m.name = name;
      m.content = content;
      document.head.appendChild(m);
      added.push(m);
    };

    // Google Tag Manager
    if (gtmId) {
      addScript(
        "gtm-script",
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`
      );
      // noscript iframe in body
      if (!document.getElementById("gtm-noscript")) {
        const ns = document.createElement("noscript");
        ns.id = "gtm-noscript";
        ns.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.prepend(ns);
        added.push(ns);
      }
    }

    // GA4 (gtag.js)
    if (ga4Id) {
      addScript("ga4-loader", undefined, `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`);
      addScript(
        "ga4-init",
        `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${ga4Id}');`
      );
    }

    // Google Ads
    if (adsId) {
      addScript("gads-loader", undefined, `https://www.googletagmanager.com/gtag/js?id=${adsId}`);
      addScript(
        "gads-init",
        `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${adsId}');`
      );
    }

    // Search Console verification (google-site-verification)
    if (searchConsole) {
      addMeta("sc-verification", "google-site-verification", searchConsole);
    }
    if (siteVerification && siteVerification !== searchConsole) {
      addMeta("site-verification-extra", "google-site-verification", siteVerification);
    }

    return () => {
      added.forEach((el) => el.parentNode?.removeChild(el));
    };
  }, [gtmId, ga4Id, adsId, searchConsole, siteVerification]);

  return null;
}

/**
 * Helper to fire a Google Ads conversion event from anywhere in the app.
 * Usage: trackAdsConversion(adsId, label, { value: 199, currency: "BRL" })
 */
export function trackAdsConversion(
  conversionId: string,
  label: string,
  params: { value?: number; currency?: string; transaction_id?: string } = {}
) {
  if (typeof window === "undefined") return;
  // @ts-expect-error gtag injected at runtime
  if (typeof window.gtag !== "function") return;
  // @ts-expect-error gtag injected at runtime
  window.gtag("event", "conversion", {
    send_to: `${conversionId}/${label}`,
    ...params,
  });
}
