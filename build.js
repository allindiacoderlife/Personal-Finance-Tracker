import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Running Personal Finance Tracker Build Process...');

if (fs.existsSync('./client')) {
  console.log('📦 Detected repo root. Building client from ./client ...');
  execSync('npm --prefix client install && npm --prefix client run build', { stdio: 'inherit' });
} else {
  console.log('📦 Already inside client directory. Building...');
  execSync('npm run build', { stdio: 'inherit' });
}

console.log('✅ Build completed successfully!');
