import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: any[];
  link?: string;
  audio?: string;
  audioTitle?: string;
};

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.toLowerCase().endsWith(".mdx"));
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);
  const metadata: Metadata = {
    title: data.title || "",
    publishedAt: data.publishedAt || "",
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || "",
    team: data.team || [],
    link: data.link || "",
    audio: data.audio || "",
    audioTitle: data.audioTitle || "",
  };
  return { metadata, content };
}

export function getPosts(customPath = ['src', 'posts']) {
  // Use path.join with process.cwd() - this is the standard for Vercel
  const postsDir = path.join(process.cwd(), ...customPath);
  
  const mdxFiles = getMDXFiles(postsDir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(postsDir, file));
    const slug = path.basename(file, path.extname(file));
    return { metadata, slug, content };
  });
}

export function debugFolder(customPath = ['src', 'posts']) {
  const dir = path.join(process.cwd(), ...customPath);
  if (!fs.existsSync(dir)) return `Missing: ${dir}`;
  return fs.readdirSync(dir).join(", ") || "Empty";
}