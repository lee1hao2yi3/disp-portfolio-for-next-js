import { notFound } from "next/navigation";
import { CustomMDX, ScrollToHash } from "@/components";
import { Meta, Schema, AvatarGroup, Button, Column, Heading, HeadingNav, Icon, Row, Text } from "@once-ui-system/core";
import { baseURL, about, blog, person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { getPosts } from "@/utils/utils";
import { Metadata as NextMetadata } from 'next';
import { BackgroundMusic } from "@/components/blog/BackgroundMusic";

interface PostMetadata {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  audio?: string;
  audioTitle?: string;
  tag?: string;
  team?: Array<{ name: string; avatar: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["public", "posts"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<NextMetadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

  const posts = getPosts(["public", "posts"])
  const post = posts.find((p) => p.slug === slugPath);

  if (!post) return {};

  const metadata = post.metadata as PostMetadata;

  return Meta.generate({
    title: metadata.title,
    description: metadata.summary,
    baseURL: baseURL,
    image: metadata.image || `/api/og/generate?title=${metadata.title}`,
    path: `${blog.path}/${post.slug}`,
  });
}

export default async function Blog({
  params
}: { params: Promise<{ slug: string | string[] }> }) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

  const post = getPosts(["public", "posts"]).find((p) => p.slug === slugPath);

  if (!post) {
    notFound();
  }

  const metadata = post.metadata as PostMetadata;

  const avatars =
    metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];

  return (
    <Row fillWidth>
      <Row maxWidth={12} hide="m"/>
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="xs" gap="l">
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={`${blog.path}/${post.slug}`}
            title={metadata.title}
            description={metadata.summary}
            datePublished={metadata.publishedAt}
            dateModified={metadata.publishedAt}
            image={metadata.image || `/api/og/generate?title=${encodeURIComponent(metadata.title)}`}
            author={{
              name: person.name,
              url: `${baseURL}${about.path}`,
              image: `${baseURL}${person.avatar}`,
            }}
          />
          
          <Button data-border="rounded" href="/blog" weight="default" variant="tertiary" size="s" prefixIcon="chevronLeft">
            Posts
          </Button>

          {/* BACKGROUND MUSIC PLAYER */}
          {metadata.audio && (
              <BackgroundMusic 
                url={metadata.audio} 
                title={metadata.audioTitle} 
              />
          )}

          <Heading variant="display-strong-s">{metadata.title}</Heading>
          
          <Row gap="12" vertical="center">
            {avatars.length > 0 && <AvatarGroup size="s" avatars={avatars} />}
            <Text variant="body-default-s" onBackground="neutral-weak">
              {metadata.publishedAt && formatDate(metadata.publishedAt)}
            </Text>
          </Row>

          <Column as="article" fillWidth>
            <CustomMDX source={post.content} />
          </Column>

          <ScrollToHash />
        </Column>
      </Row>

      <Column maxWidth={12} paddingLeft="40" fitHeight position="sticky" top="80" gap="16" hide="m">
        <Row
          gap="12"
          paddingLeft="2"
          vertical="center"
          onBackground="neutral-medium"
          textVariant="label-default-s"
        >
          <Icon name="document" size="xs" />
          On this page
        </Row>
        <HeadingNav fitHeight/>
      </Column>
    </Row>
  );
}