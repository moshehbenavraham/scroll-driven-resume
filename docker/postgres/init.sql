-- Modern Resume Site - PostgreSQL Initialization Script
-- This script runs on first container startup only

-- Create schema for asset metadata
CREATE SCHEMA IF NOT EXISTS assets;

-- Asset metadata table
CREATE TABLE IF NOT EXISTS assets.frames (
    id SERIAL PRIMARY KEY,
    bucket VARCHAR(64) NOT NULL,
    object_key VARCHAR(255) NOT NULL,
    variant VARCHAR(32) NOT NULL,  -- 'desktop' or 'mobile'
    sequence_name VARCHAR(64) NOT NULL,  -- 'hero' or 'product'
    frame_number INTEGER NOT NULL,
    file_size INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    checksum VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bucket, object_key)
);

-- Index for efficient frame sequence queries
CREATE INDEX IF NOT EXISTS idx_frames_sequence
    ON assets.frames(sequence_name, variant, frame_number);

-- Bucket metadata table
CREATE TABLE IF NOT EXISTS assets.buckets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default buckets
INSERT INTO assets.buckets (name, description) VALUES
    ('frames-desktop', 'Desktop frame sequences (1920x1080)'),
    ('frames-mobile', 'Mobile frame sequences (750x1334)')
ON CONFLICT (name) DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA assets TO resume_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA assets TO resume_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA assets TO resume_admin;
