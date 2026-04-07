import { Column, Heading, Meta, Schema, Row, Button } from "@once-ui-system/core";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { baseURL, blog, person, newsletter } from "@/resources";

// ... keep your generateMetadata function as is ...

export default async function Blog({ 
    searchParams 
}: { 
    searchParams: Promise<{ page?: string }> 
}) {
    const { page } = await searchParams;
    const currentPage = parseInt(page || "1");
    const postsPerPage = 10;

    // Calculate the range (e.g. Page 1: [1, 10], Page 2: [11, 20])
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

            {/* The Blog List */}
            <Column fillWidth flex={1} gap="m">
                <Posts range={[start, end]} thumbnail direction="column"/>
            </Column>

            {/* Pagination Buttons */}
            <Row fillWidth gap="m" marginTop="xl" horizontal="center">
                {currentPage > 1 && (
                    <Button 
                        href={`/blog?page=${currentPage - 1}`} 
                        variant="secondary" 
                        label="Previous" 
                    />
                )}
                <Button 
                    href={`/blog?page=${currentPage + 1}`} 
                    variant="secondary" 
                    label="Next" 
                />
            </Row>

            {newsletter.display && <Mailchimp newsletter={newsletter} />}
        </Column>
    );
}