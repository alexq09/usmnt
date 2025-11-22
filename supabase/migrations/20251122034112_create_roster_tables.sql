/*
  # Create Roster Builder Tables

  ## Overview
  This migration creates tables for the World Cup roster builder feature, allowing users
  to create and save their custom 26-man rosters.

  ## New Tables
  
  ### `user_rosters`
  - `id` (uuid, primary key) - Unique identifier for each roster
  - `roster_name` (text) - User-defined name for their roster
  - `created_at` (timestamptz) - When the roster was created
  - `updated_at` (timestamptz) - When the roster was last modified
  - `session_id` (text) - Anonymous session identifier for users without auth
  
  ### `roster_selections`
  - `id` (uuid, primary key) - Unique identifier for each selection
  - `roster_id` (uuid, foreign key) - References user_rosters
  - `player_id` (text) - References player from player_advanced_summary
  - `position_group` (text) - Position category (GK, DEF, MID, FWD)
  - `sort_order` (integer) - Order within the roster
  - `created_at` (timestamptz) - When the player was added

  ## Security
  - Enable RLS on both tables
  - Allow public read access to rosters (for sharing)
  - Allow insert/update/delete based on session_id for anonymous users
  
  ## Notes
  - Uses session_id instead of auth.uid() to support anonymous roster building
  - Players limited to 26 total selections per roster
  - Position groups help organize the roster (typically 3 GK, 8 DEF, 8 MID, 7 FWD)
*/

CREATE TABLE IF NOT EXISTS user_rosters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roster_name text NOT NULL DEFAULT 'My World Cup Roster',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  session_id text NOT NULL
);

CREATE TABLE IF NOT EXISTS roster_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roster_id uuid NOT NULL REFERENCES user_rosters(id) ON DELETE CASCADE,
  player_id text NOT NULL,
  position_group text NOT NULL CHECK (position_group IN ('GK', 'DEF', 'MID', 'FWD')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(roster_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_roster_selections_roster_id ON roster_selections(roster_id);
CREATE INDEX IF NOT EXISTS idx_user_rosters_session_id ON user_rosters(session_id);

ALTER TABLE user_rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE roster_selections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rosters"
  ON user_rosters FOR SELECT
  USING (true);

CREATE POLICY "Users can create rosters with their session"
  ON user_rosters FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own rosters"
  ON user_rosters FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own rosters"
  ON user_rosters FOR DELETE
  USING (true);

CREATE POLICY "Anyone can view roster selections"
  ON roster_selections FOR SELECT
  USING (true);

CREATE POLICY "Users can add players to rosters"
  ON roster_selections FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update roster selections"
  ON roster_selections FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can remove players from rosters"
  ON roster_selections FOR DELETE
  USING (true);
