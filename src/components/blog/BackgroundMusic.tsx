'use client';

import { useState, useRef, useEffect } from 'react';
import { Row, Button, Text, Icon } from "@once-ui-system/core";

interface BackgroundMusicProps {
    url: string;
    title?: string;
}

export const BackgroundMusic = ({ url, title }: BackgroundMusicProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Try to autoplay when the component loads
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => {
                    console.log("Autoplay blocked. Browser requires user interaction first.");
                });
        }
    }, []);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <Row 
            fillWidth 
            padding="12" 
            radius="l" 
            background="neutral-alpha-medium" 
            border="neutral-alpha-weak"
            vertical="center"
            horizontal="space-between"
            marginBottom="m"
        >
            <Row gap="12" vertical="center">
                <Icon 
                    name="music" 
                    size="s" 
                    onBackground="neutral-medium" 
                />
                <Text variant="body-default-s" onBackground="neutral-strong">
                    {isPlaying ? `Playing: ${title || 'Background Music'}` : `Music: ${title || 'Paused'}`}
                </Text>
            </Row>
            
            {/* Added 'loop' and 'autoPlay' here */}
            <audio ref={audioRef} src={url} loop autoPlay />
            
            <Button 
                variant="secondary" 
                size="s" 
                onClick={toggleMusic}
                prefixIcon={isPlaying ? "stop" : "play"}
            >
                {isPlaying ? "Mute" : "Play"}
            </Button>
        </Row>
    );
};