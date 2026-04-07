'use client';

import { Row } from "@once-ui-system/core";

interface YouTubeProps {
    id: string;
    title?: string;
}

export const YouTube = ({ id, title = "YouTube video player" }: YouTubeProps) => {
    return (
        <Row
            fillWidth
            radius="l"
            overflow="hidden"
            aspectRatio="16 / 9"
            marginBottom="m"
            background="neutral-alpha-weak"
            style={{ border: '1px solid var(--neutral-alpha-weak)' }}
        >
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${id}`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ border: 'none' }}
            ></iframe>
        </Row>
    );
};