const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('./fix-screens-codegen');

// Target paths
const javaHome = path.normalize('C:/Users/Ronit/.jdks/jdk-17.0.12+7');
const javaBin = path.join(javaHome, 'bin');
const sdkPath = path.normalize('C:/Users/Ronit/AppData/Local/Android/Sdk');
const platformTools = path.join(sdkPath, 'platform-tools');
const emulatorPath = path.join(sdkPath, 'emulator');
const rootDir = path.resolve(__dirname, '..');

// Inject environment variables
const env = {
  ...process.env,
  JAVA_HOME: javaHome,
  ANDROID_HOME: sdkPath,
  ANDROID_SDK_ROOT: sdkPath,
  PATH: `${javaBin};${platformTools};${emulatorPath};${process.env.PATH || ''}`,
};

console.log('🚀 Launching Android build with configured environment:');
console.log(`   JAVA_HOME: ${javaHome}`);
console.log(`   ANDROID_HOME: ${sdkPath}`);

const autolinkJson = path.join(rootDir, 'autolinking.json');

try {
  const configOutput = execSync('npx react-native config', {
    cwd: rootDir,
    encoding: 'utf8',
    env: env,
  });
  const jsonStart = configOutput.indexOf('{');
  const jsonEnd = configOutput.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    const cleanJson = configOutput.substring(jsonStart, jsonEnd + 1);
    JSON.parse(cleanJson);
    fs.writeFileSync(autolinkJson, cleanJson);
    console.log('✅ Generated autolinking.json configuration');
  }
} catch (e) {
  if (!fs.existsSync(autolinkJson)) {
    fs.writeFileSync(autolinkJson, JSON.stringify({ dependencies: {}, project: { android: {} } }));
  }
}

// Run react-native run-android with the injected environment
const isWin = process.platform === 'win32';
const cmd = isWin ? 'npx.cmd' : 'npx';

const child = spawn(cmd, ['react-native', 'run-android'], {
  stdio: 'inherit',
  env: env,
  shell: true,
  cwd: rootDir,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
