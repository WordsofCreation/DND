import { copyFileSync, cpSync, mkdirSync, rmSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
cpSync('index.html', 'dist/index.html');
cpSync('src', 'dist/src', { recursive: true });
copyFileSync('.nojekyll', 'dist/.nojekyll');
copyFileSync('404.html', 'dist/404.html');
console.log('Built static site to dist/');
