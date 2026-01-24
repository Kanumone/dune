-- Migration: Add can_show column to locations table
ALTER TABLE "locations" ADD COLUMN "can_show" boolean DEFAULT true NOT NULL;
