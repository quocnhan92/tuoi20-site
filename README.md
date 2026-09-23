# Tuoi20 Studio public site

Public companion website for the private Tuoi20 video pipeline.
Planned URL: https://quocnhan92.github.io/tuoi20-site/

Enable Settings → Pages → Source: GitHub Actions. Push main to deploy.
Only static website files and TikTok verification text files are published.
Never add client secrets, refresh tokens, OAuth response files, queue data or generated private media.

OAuth starts in the private repo's `scripts/tiktok_oauth.py start`; this site checks browser state and downloads a one-use response file. Token exchange occurs locally. No backend runs on GitHub Pages.

Preview: `python3 -m http.server 8080`. No build dependencies.
