/*
  # Create urls table

  1. New Tables
    - `urls`
      - `id` (uuid, primary key)
      - `long_url` (text, not null)
      - `short_url` (text, not null)
      - `user_id` (uuid, references users.id)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `urls` table
    - Add policy for authenticated users to create, read, and update their own data
    - Add policy for everyone to read data
*/

CREATE TABLE IF NOT EXISTS urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  long_url text NOT NULL,
  short_url text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE urls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create urls"
  ON urls
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own urls"
  ON urls
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable read access for all users" ON public.urls FOR
SELECT USING (true);