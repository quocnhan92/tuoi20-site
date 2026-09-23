let previewUrl;
document.getElementById('preview').addEventListener('change', event => {
  const video = document.getElementById('player');
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  const file = event.target.files[0];
  video.hidden = !file;
  if (file) { previewUrl = URL.createObjectURL(file); video.src = previewUrl; }
  else { video.removeAttribute('src'); video.load(); }
});
