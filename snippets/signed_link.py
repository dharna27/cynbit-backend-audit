/ app/layout.tsx
export const metadata = {
  metadataBase: new URL("https://www.cynbit.in"),
  openGraph: { siteName: "Cynbit Technologies", images: ["/og-1200x630.png"] },
};
// app/contact/page.tsx
export const metadata = {
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};
// next.config.js (add inside module.exports)
async redirects() {
  return [{
    source: "/:path*",
    has: [{ type: "host", value: "cynbit.in" }],
    destination: "https://www.cynbit.in/:path*",
    permanent: true,
  }];
},
