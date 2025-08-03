"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from './UserProvider';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Navigation = () => {
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-lg font-semibold text-gray-900 dark:text-white">shortURL</a>
        {user ? (
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.email}`} alt={user.email} />
              <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
            <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
          </div>
        ) : (
          <div className="space-x-2">
            <Button onClick={() => router.push('/login')} variant="outline">Login</Button>
            <Button onClick={() => router.push('/register')}>Register</Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
