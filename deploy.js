import rclone from 'rclone.js';
const source = './dist/';
const dest = 'ftp-retrohandhelds:randomizer.retrohandhelds.gg';

(async () => {
  try {
    await rclone.promises.copy(source, dest); // upload any new files
    await rclone.promises.sync(source, dest); // delete's any removed files once the upload succeeds.
  } catch (e) {
    console.error('failed to upload files.');
    process.exit(1);
  }
})();
