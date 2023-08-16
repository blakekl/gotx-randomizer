import rclone from 'rclone.js';
const source = './dist/';
const dest = 'ftp-retrohandhelds:randomizer';

(async () => {
  try {
    await rclone.promises.copy(source, dest);
  } catch (e) {
    console.error('failed to upload files.');
    process.exit(1);
  }
})();
