import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Usage: node update_version.js <new_version>
const newVersion = process.argv[2];

// Validate version format
if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(newVersion)) {
  // Recursively find all package.json files, excluding node_modules
  function findPackageJsonFiles(dir) {
    const results = [];
    const files = readdirSync(dir);

    files.forEach(file => {
      const filePath = join(dir, file);
      const stat = statSync(filePath);

      if (stat.isDirectory() && file !== 'node_modules') {
        results.push(...findPackageJsonFiles(filePath));
      } else if (file === 'package.json') {
        results.push(filePath);
      }
    });

    return results;
  }

  const packageJsonFiles = findPackageJsonFiles(process.cwd());

  packageJsonFiles.forEach(filePath => {
    const content = readFileSync(filePath, 'utf-8');
    const currentVersionMatch = content.match(/"version":\s*"([^"]+)"/);

    if (currentVersionMatch) {
      const currentVersion = currentVersionMatch[1];
      const updatedContent = content.replace(`"version": "${currentVersion}"`, `"version": "${newVersion}"`);

      writeFileSync(filePath, updatedContent, 'utf-8');
      console.log(`Updated version in ${filePath} from ${currentVersion} to ${newVersion}`);
    }
  });

  console.log(`Updated versions to ${newVersion}`);
} else {
  console.error(`Version format <${newVersion}> isn't correct, proper format is <0.0.0>`);
}
