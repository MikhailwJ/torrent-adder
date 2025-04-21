import { readFileSync, writeFileSync, renameSync } from 'fs';
import { tmpdir } from 'os';

// Default values
let CLI_CEB_DEV = false;
let CLI_CEB_FIREFOX = false;
const cliValues = [];

// Validate if a value is boolean
function validateIsBoolean(value, key) {
  if (value !== 'true' && value !== 'false') {
    console.error(`Invalid value for <${key}>. Please use 'true' or 'false'.`);
    process.exit(1);
  }
}

// Validate if a key starts with CLI_CEB_ or CEB_
function validateKey(key, isEditableSection = false) {
  if (key && !key.startsWith('#')) {
    if (isEditableSection && !key.startsWith('CEB_')) {
      console.error(`Invalid key: <${key}>. All keys in the editable section must start with 'CEB_'.`);
      process.exit(1);
    } else if (!isEditableSection && !key.startsWith('CLI_CEB_')) {
      console.error(`Invalid key: <${key}>. All CLI keys must start with 'CLI_CEB_'.`);
      process.exit(1);
    }
  }
}

// Parse command-line arguments
function parseArguments(args) {
  args.forEach(arg => {
    const [key, value] = arg.split('=');

    validateKey(key);

    switch (key) {
      case 'CLI_CEB_DEV':
        CLI_CEB_DEV = value;
        validateIsBoolean(CLI_CEB_DEV, 'CLI_CEB_DEV');
        break;
      case 'CLI_CEB_FIREFOX':
        CLI_CEB_FIREFOX = value;
        validateIsBoolean(CLI_CEB_FIREFOX, 'CLI_CEB_FIREFOX');
        break;
      default:
        cliValues.push(`${key}=${value}`);
        break;
    }
  });
}

// Validate keys in .env file
function validateEnvKeys() {
  const envFile = readFileSync('.env', 'utf-8');
  const lines = envFile.split('\n');
  let editableSectionStarts = false;

  lines.forEach(line => {
    const key = line.split('=')[0];
    if (key.startsWith('CLI_CEB_')) {
      editableSectionStarts = true;
    } else if (editableSectionStarts) {
      validateKey(key, true);
    }
  });
}

// Create a new .env file
function createNewFile() {
  const tempFile = `${tmpdir()}/temp_env_${Date.now()}`;

  const cliSection = [
    '# THOSE VALUES ARE EDITABLE ONLY VIA CLI',
    `CLI_CEB_DEV=${CLI_CEB_DEV}`,
    `CLI_CEB_FIREFOX=${CLI_CEB_FIREFOX}`,
    ...cliValues,
    '',
    '# THOSE VALUES ARE EDITABLE',
  ].join('\n');

  const existingEnvValues = readFileSync('.env', 'utf-8')
    .split('\n')
    .filter(line => line.startsWith('CEB_'))
    .join('\n');

  writeFileSync(tempFile, `${cliSection}\n${existingEnvValues}`);
  renameSync(tempFile, '.env');
}

// Main script execution
const args = process.argv.slice(2);
parseArguments(args);
validateEnvKeys();
createNewFile();
