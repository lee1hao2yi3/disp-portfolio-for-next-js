import { Column, Heading, Meta, Schema, Row, Button, Text } from "@once-ui-system/core";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { baseURL, blog, person, newsletter } from "@/resources";
import { getPosts } from "@/utils/utils";

export async function generateMetadata() {
    return Meta.generate({
        title: blog.title,
        description: blog.description,
        baseURL: baseURL,
        image: `/api/og/generate?title=${encodeURIComponent(blog.title)}`,
        path: blog.path,
    });
}

export default async function Blog(props: { 
    searchParams: Promise<{ page?: string }> 
}) {
    const searchParams = await props.searchParams;
    const page = searchParams.page;
    const currentPage = parseInt(page || "1");
    const postsPerPage = 10;

    // SAFETY CHECK: Try to get posts. If folder is missing, don't crash.
    let allPosts = [];
    try {
        allPosts = getPosts(["src", "posts"]);
    } catch (e) {
        console.error("Folder src/posts not found!");
    }

    const totalPages = Math.max(1, Math.ceil(allPosts.length / postsPerPage));

    const start = (currentPage - 1) * postsPerPage + 1;
    const end = currentPage * postsPerPage;

    return (
        <Column maxWidth="s">
            <Schema
                as="blogPosting"
                baseURL={baseURL}
                title={blog.title}
                description={blog.description}
                path={blog.path}
                image={`/api/og/generate?title=${encodeURIComponent(blog.title)}`}
                author={{
                    name: person.name,
                    url: `${baseURL}/blog`,
                    image: `${baseURL}${person.avatar}`,
                }}
            />
            <Heading marginBottom="l" variant="display-strong-s">
                {blog.title}
            </Heading>

            {allPosts.length === 0 ? (
                <Text>No posts found in src/posts. Please check your folder name.</Text>
            ) : (
                <Column fillWidth flex={1} gap="m">
                    <Posts range={[start, end]} thumbnail direction="column"/>
                </Column>
            )}

            <Row 
                fillWidth 
                gap="8" 
                marginTop="xl" 
                marginBottom="xl" 
                horizontal="center" 
                vertical="center"
            >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                        key={pageNum}
                        href={`/blog?page=${pageNum}`}
                        variant={currentPage === pageNum ? "secondary" : "tertiary"}
                        size="s"
                        label={pageNum.toString()}
                    />
                ))}
            </Row>

            {newsletter.display && <Mailchimp newsletter={newsletter} />}
        </Column>
    );
}