import Script from "next/script";

/**
 * GA4 (gtag.js) for the public site. Uses the Firebase-linked measurement ID.
 * Renders nothing when the ID isn't configured, so local/preview builds without
 * the env var are a safe no-op.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
