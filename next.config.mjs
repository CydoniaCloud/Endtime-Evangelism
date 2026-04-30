import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    mdxRs: false,
  },
  reactStrictMode: true,
  // The "N" badge in the bottom corner during `next dev` is Next.js's own
  // dev-tools indicator — it does NOT render in production builds. Setting
  // this to false hides it locally too, so the design system is faithful
  // even while running `next dev`.
  devIndicators: false,
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkSmartypants],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
