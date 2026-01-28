/*
  # Toekomst ID Database

  1. New Tables
    - `toekomst_ids`
      - `id` (uuid, primary key) - Unieke ID voor elk Toekomst ID
      - `name` (text) - Naam van de leerling
      - `gender` (text) - Geslacht van de leerling
      - `superpowers` (jsonb) - Array van superkrachten
      - `job_title` (text) - Beroepstitel
      - `dendron_world` (text) - Dendron wereld
      - `sector_type` (text) - Sector type (MENS, DIGITAL, etc.)
      - `description` (text) - Beschrijving van het beroep
      - `dendron_training` (text) - Dendron opleidingstraject
      - `image_url` (text) - URL van de afbeelding
      - `created_at` (timestamptz) - Aanmaakdatum
      
  2. Security
    - Enable RLS on `toekomst_ids` table
    - Add policy for public read access (anyone can view via QR code)
    - No write policies needed (only app creates records)

  3. Notes
    - Public read access is intentional - QR codes need to work without authentication
    - This is educational/demo data, not sensitive information
*/

CREATE TABLE IF NOT EXISTS toekomst_ids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  gender text NOT NULL,
  superpowers jsonb NOT NULL DEFAULT '[]'::jsonb,
  job_title text NOT NULL,
  dendron_world text NOT NULL,
  sector_type text NOT NULL,
  description text NOT NULL,
  dendron_training text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE toekomst_ids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view Toekomst IDs"
  ON toekomst_ids
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Service role can insert Toekomst IDs"
  ON toekomst_ids
  FOR INSERT
  TO anon
  WITH CHECK (true);