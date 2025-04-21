import { existsSync, copyFileSync } from 'fs';

// Check if .env does not exist and .example.env exists
if (!existsSync('.env') && existsSync('.example.env')) {
  // Copy .example.env to .env
  copyFileSync('.example.env', '.env');
  console.log('.example.env has been copied to .env');
}
