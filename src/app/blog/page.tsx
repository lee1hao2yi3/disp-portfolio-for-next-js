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

    // Fetch posts
    let allPosts = [];
    try {
        allPosts = getPosts(["src", "posts"]);
    } catch (e) {
        console.error("Critical: Could not find src/posts directory");
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

            {/* IF POSTS ARE FOUND */}
            {allPosts.length > 0 ? (
                <Column fillWidth flex={1} gap="m">
                    <Posts range={[start, end]} thumbnail direction="column"/>
                </Column>
            ) : (
                /* DEBUGGER: This only shows if the list is empty */
                <Column 
                    background="neutral-alpha-medium" 
                    padding="32" 
                    radius="l" 
                    border="neutral-alpha-weak"
                    gap="12"
                >
                    <Text variant="body-strong-m" onBackground="danger-strong">
                        ⚠️ No posts found on the server.
                    </Text>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                        The code is looking for: <b>/src/posts</b>
                    </Text>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                        Check if your filenames end in <b>.mdx</b> (lowercase) and that the folder name is exactly <b>posts</b>.
                    </Text>
                </Column>
            )}

            {/* Pagination Jumper */}
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