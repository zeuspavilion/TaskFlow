const fs = require('fs');
const path = require('path');

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      processDir(full);
    } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      let content = fs.readFileSync(full, 'utf8');
      let changed = false;
      if (content.includes('CodegenTypes as CT') || content.includes('CT.') || content.includes('WithDefault<boolean, true>') || content.includes('WithDefault<boolean,true>') || content.includes('ComponentRef') || content.includes('NativeMenuElementOptionsIOS[]') || content.includes('StackHeaderToolbarMenuElementUpdateNativeAndroid[]')) {
        content = content.replace(/CodegenTypes as CT/g, 'WithDefault,\n  DirectEventHandler,\n  BubblingEventHandler,\n  Double,\n  Float,\n  Int32');
        content = content.replace(/CT\./g, '');
        content = content.replace(/WithDefault<boolean,\s*true>/g, 'boolean');
        content = content.replace(/ComponentRef/g, 'ElementRef');
        content = content.replace(/options:\s*NativeMenuElementOptionsIOS\[\]/g, 'options: string');
        content = content.replace(/updates:\s*StackHeaderToolbarMenuElementUpdateNativeAndroid\[\]/g, 'updates: string');
        fs.writeFileSync(full, content, 'utf8');
        console.log('Fixed codegen file:', f);
      }
    }
  }
}

const fabricDir = path.resolve(__dirname, '..', 'node_modules', 'react-native-screens', 'src', 'fabric');
processDir(fabricDir);
console.log('Codegen types normalization complete.');
