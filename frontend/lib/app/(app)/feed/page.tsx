'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { makeSocket } from '@/lib/socket';
import { Card } from '@/components/ui/card';

export default function FeedPage() {
  const [items, setItems] = useState<any[]>([]);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    (async () => {
      const me = await api.get('/me', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const feed = await api.get('/posts/feed', { headers: { Authorization: `Bearer ${token}` } });
      setItems(feed.data);
      const socket = makeSocket(token);
      socket.on('notification', (n) => {
        // Optionally refetch feed or show toast
        console.log('Notification:', n);
      });
      return () => socket.disconnect();
    })();
  }, [token]);

  return (
    <div className="max-w-xl mx-auto space-y-3 p-4">
      {items.map((p) => (
        <Card key={p._id} className="p-3">{p.text}</Card>
      ))}
    </div>
  );
}
