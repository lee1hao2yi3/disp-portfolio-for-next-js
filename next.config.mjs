import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  // FIXED: This forces Vercel to include your 'posts' folder in the serverless function
  experimental: {
    outputFileTracingIncludes: {
      '/blog': ['./src/posts/**/*'],
      '/blog/*': ['./src/posts/**/*'],
    },
  },
};

export default withMDX(nextConfig);