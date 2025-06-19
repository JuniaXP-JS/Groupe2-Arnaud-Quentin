import { useEffect, useState } from 'react';

interface AnnouncerProps {
    message: string;
    priority?: 'polite' | 'assertive';
    clearAfter?: number;
}

export function Announcer({ message, priority = 'polite', clearAfter = 1000 }: AnnouncerProps) {
    const [announcement, setAnnouncement] = useState('');

    useEffect(() => {
        if (message) {
            setAnnouncement(message);
            const timer = setTimeout(() => setAnnouncement(''), clearAfter);
            return () => clearTimeout(timer);
        }
    }, [message, clearAfter]);

    return (
        <div
            aria-live={priority}
            aria-atomic="true"
            className="sr-only"
            role="status"
            id="announcer-region"
        >
            {announcement}
        </div>
    );
}

export function useAnnouncer() {
    const [message, setMessage] = useState('');

    const announce = (text: string) => {
        setMessage(text);
    };

    return { message, announce };
}
