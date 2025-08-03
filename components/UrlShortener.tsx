"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/hooks/use-toast";
import { useUser } from './UserProvider';
import { useCopyToClipboard } from 'usehooks-ts'

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [error, setError] = useState('');
  const [urlCount, setUrlCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const [value, copy] = useCopyToClipboard()

  const MAX_FREE_URLS = 5;
  const SHORT_DOMAIN = 'https://short.url'; // Replace with your actual short domain

  useEffect(() => {
    const fetchUrlCount = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('urls')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching URL count:', error);
        } else {
          setUrlCount(data ? data.length : 0);
        }
      }
    };

    fetchUrlCount();
  }, [user]);

  const shortenUrl = async () => {
    setError('');
    setShortenedUrl('');
    setLoading(true);

    if (!longUrl) {
      setError('Please enter a URL');
      setLoading(false);
      return;
    }

    if (!user && urlCount >= MAX_FREE_URLS) {
      setError('You have reached the limit of free URLs. Register for unlimited access.');
      setLoading(false);
      return;
    }

    const randomString = Math.random().toString(36).substring(2, 8);
    const shortUrl = `${SHORT_DOMAIN}/${randomString}`;

    console.log('Long URL:', longUrl);
    console.log('Short URL:', shortUrl);

    const urlData = {
      long_url: longUrl,
      short_url: shortUrl,
      user_id: user ? user.id : null,
    };

    console.log('urlData before insert:', urlData);
    console.log('longUrl before insert:', longUrl);
    console.log('shortUrl before insert:', shortUrl);

    let insertResult;
    try {
      insertResult = await supabase
        .from('urls')
        .insert([urlData])
        .select();
    } catch (e) {
      console.error("Supabase insert error (caught):", e);
      setError('Failed to shorten URL');
      setLoading(false);
      return;
    }

    if (insertResult.error) {
      console.error('Error shortening URL:', insertResult.error);
      console.error('Supabase error object:', insertResult.error);
      setError('Failed to shorten URL');
    } else {
      console.log('Supabase data on success:', insertResult.data);
      setShortenedUrl(shortUrl);
      setUrlCount(urlCount + 1);
      toast({
        title: "URL Shortened!",
        description: "Your URL has been successfully shortened.",
      });
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">shortURL</h2>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="flex flex-col space-y-3 mt-4">
          <Input
            type="url"
            placeholder="Enter long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          />
          <Button
            onClick={shortenUrl}
            disabled={loading}
            className="bg-primary text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          >
            {loading ? "Shortening..." : "Shorten"}
          </Button>
        </div>
        {shortenedUrl && (
          <div className="mt-4">
            <p className="text-gray-700 dark:text-gray-300">Shortened URL:</p>
            <div className="flex items-center">
              <a
                href={shortenedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline truncate"
              >
                {shortenedUrl}
              </a>
              <Button variant="secondary" size="sm" onClick={() => copy(shortenedUrl)}>
                {value.text === shortenedUrl ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        )}
        {!user && urlCount >= MAX_FREE_URLS && (
          <p className="text-yellow-500 mt-3">
            You have reached the limit of {MAX_FREE_URLS} free URLs.{" "}
            <a href="/register" className="underline">
              Register
            </a>{" "}
            for unlimited access.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UrlShortener;
