const fs = require('fs-extra');
const path = require('path');

async function copyBuildFiles() {
  try {
    const sourceDir = path.join(__dirname, 'client', 'dist');
    const targetDir = path.join(__dirname, 'dist');
    
    console.log(`Copying from ${sourceDir} to ${targetDir}`);
    
    // Ensure target directory exists
    await fs.ensureDir(targetDir);
    
    // Copy all files from client/dist to dist
    await fs.copy(sourceDir, targetDir, { overwrite: true });
    
    console.log('Build files copied successfully!');
  } catch (error) {
    console.error('Error copying build files:', error);
    process.exit(1);
  }
}

copyBuildFiles();