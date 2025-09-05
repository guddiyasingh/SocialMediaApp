'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function CreatePost({ token }: { token: string }) {
  const [text, setText] = useState('');
  const submit = async () => {
    await api.post('/posts', { text }, { headers: { Authorization: `Bearer ${token}` } });
    setText('');
  };
  return (
    <div className="space-y-2">
      <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="What's happening?" />
      <Button onClick={submit}>Post</Button>
    </div>
  );
}
