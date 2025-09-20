const fs = require('fs');
const path = require('path');

function injectConsoleCapture() {
  console.log('🔧 Injecting console capture script into HTML files...');
  
  const buildDir = path.join(process.cwd(), '.next');
  const scriptTag = '<script src="/dashboard-console-capture.js"></script>';
  
  function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (item.endsWith('.html')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Only inject if not already present
        if (!content.includes('dashboard-console-capture.js')) {
          // Try to inject in <head> section first
          if (content.includes('<head>')) {
            content = content.replace('<head>', `<head>${scriptTag}`);
          } else if (content.includes('<html>')) {
            // Fallback: inject after <html>
            content = content.replace('<html>', `<html>${scriptTag}`);
          }
          
          fs.writeFileSync(fullPath, content);
          console.log(`✅ Injected console capture into: ${fullPath}`);
        }
      }
    });
  }
  
  processDirectory(buildDir);
  console.log('✨ Console capture injection complete!');
}

// Run if called directly
if (require.main === module) {
  injectConsoleCapture();
}

module.exports = injectConsoleCapture;