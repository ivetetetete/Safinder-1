// hooks/useEvents.ts

import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from "../library/firebaseConfig";

interface Event {
    id: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
}

export const useEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            const eventsCollection = collection(db, 'events');
            const querySnapshot = await getDocs(eventsCollection);

            const fetchedEvents: Event[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedEvents.push({
                    id: doc.id,
                    title: data.title || 'Sin título',
                    description: data.description || '',
                    latitude: data.x,
                    longitude: data.y,
                });
            });

            setEvents(fetchedEvents);
            setError(null);
        } catch (err) {
            console.error('Error fetching events: ', err);
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setLoading(false);
        }

        console.log('loading', loading);
    }, []);

    return { events, loading, error, fetchEvents };
};