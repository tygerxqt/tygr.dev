# ☁ Preview  
![](https://images.ctfassets.net/547zkxycwgvr/6C4HFntLtkxdyM4Ibaetku/0133d3d2c10ba151e539104f5777eb52/firefox_U03cNvDHse.png)

# Tech stack
* Framework: [NextJS](https://nextjs.org/)
* Deployment: [Vercel](https://vercel.com/)
* Content: [MDX](https://mdxjs.com/)
* CMS: [Contentful](https://contentful.com/)
* Styling: [Chakra UI](https://chakra-ui.com/)
* Authentication / Database: [Supabase](https://supabase.com/)
* Auth CMS: [Deta](https://deta.sh/)

# 1-Click Deploys
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftygerxqt%2Ftygr.dev&env=NEXT_PUBLIC_URL,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_KEY,DETA_PROJECT_ID,DETA_PROJECT_KEY,CONTENTFUL_SPACE_ID,CONTENTFUL_ACCESS_TOKEN&envDescription=API%20Keys%20needed%20for%20the%20app.&envLink=https%3A%2F%2Fgithub.com%2Ftygerxqt%2Ftygr.dev%23running-locally&project-name=website&repo-name=website&demo-title=tygr.dev)

# Running locally
```bash
$ git clone https://github.com/tygerxqt/tygr.dev
$ cd tygr.dev
$ yarn
```
Create a `.env` file, an example is shown below. Please use your own values:
```
// Common
NEXT_PUBLIC_URL=https://tygr.dev

// Authentication
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_KEY=YOUR_SUPABASE_KEY
SUPABASE_ADMIN_KEY=YOUR_SUPBASE_SERVICE_KEY

// Avatars and banners
DETA_PROJECT_KEY=YOUR_DETA_KEY
DETA_PROJECT_ID=YOUR_DETA_ID

// Discord
NEXT_PUBLIC_DISCORD_CLIENT_ID=YOUR-DISCORD-OAUTH-ID
DISCORD_CLIENT_SECRET=YOUR-DISCORD-OAUTH-SECRET

// GitHub
NEXT_PUBLIC_GITHUB_CLIENT_ID=YOUR-GITHUB-OAUTH-ID
GITHUB_CLIENT_SECRET=YOUR-GITHUB-OAUTH-SECRET

// Contentful
CONTENTFUL_ACCESS_TOKEN=YOUR_CONTENTFUL_TOKEN
CONTENTFUL_SPACE_ID=YOUR_CONTENTFUL_SPACEID
```

# Badges
[![CodeQL](https://github.com/tygerxqt/tygr.dev/actions/workflows/CodeQL.yml/badge.svg?branch=main)](https://github.com/tygerxqt/tygr.dev/actions/workflows/CodeQL.yml)  
[![Dependency Review](https://github.com/tygerxqt/tygr.dev/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/tygerxqt/tygr.dev/actions/workflows/dependency-review.yml)

# Help
If more help is needed, you can contact me by [e-mail](mailto:tygerxqt@nordstud.io) or [tweet](https://twitter.com/intent/tweet?text=%40tygerxqt) to me.
