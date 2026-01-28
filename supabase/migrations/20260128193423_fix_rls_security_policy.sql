/*
  # Fix RLS Security Policy for toekomst_ids
  
  1. Security Improvements
    - Drop the unrestricted INSERT policy that allows any data
    - Create a new INSERT policy with proper validation
    - Ensure all required fields are non-empty
    - Add constraints to prevent invalid data
  
  2. Changes
    - Remove policy: "Service role can insert Toekomst IDs" (has WITH CHECK true)
    - Add new policy: "Validated insert for Toekomst IDs" with proper checks
    - Validates: name, job_title, dendron_world, sector_type, description, dendron_training are not empty
  
  3. Notes
    - This maintains public insert capability (needed for demo app)
    - But adds validation to prevent malicious/invalid data
    - Rate limiting should be implemented at application level
*/

-- Drop the insecure policy
DROP POLICY IF EXISTS "Service role can insert Toekomst IDs" ON toekomst_ids;

-- Create a new policy with proper validation
CREATE POLICY "Validated insert for Toekomst IDs"
  ON toekomst_ids
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Ensure name is provided and not empty
    name IS NOT NULL AND 
    length(trim(name)) > 0 AND
    length(name) <= 100 AND
    
    -- Ensure job_title is provided and not empty
    job_title IS NOT NULL AND 
    length(trim(job_title)) > 0 AND
    length(job_title) <= 200 AND
    
    -- Ensure dendron_world is provided and not empty
    dendron_world IS NOT NULL AND 
    length(trim(dendron_world)) > 0 AND
    length(dendron_world) <= 200 AND
    
    -- Ensure sector_type is provided and not empty
    sector_type IS NOT NULL AND 
    length(trim(sector_type)) > 0 AND
    length(sector_type) <= 100 AND
    
    -- Ensure description is provided and not empty
    description IS NOT NULL AND 
    length(trim(description)) > 0 AND
    length(description) <= 2000 AND
    
    -- Ensure dendron_training is provided and not empty
    dendron_training IS NOT NULL AND 
    length(trim(dendron_training)) > 0 AND
    length(dendron_training) <= 2000 AND
    
    -- Ensure gender is provided
    gender IS NOT NULL AND
    length(gender) > 0 AND
    
    -- Ensure superpowers is valid JSONB
    superpowers IS NOT NULL
  );