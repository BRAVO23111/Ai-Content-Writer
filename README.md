


          
# AI Content Writer SaaS

A modern SaaS application for generating, managing, and distributing AI-powered content, with seamless Twitter integration and a user-friendly dashboard.

## Features
- **User Authentication:** Secure signup and login
- **AI Content Generation:** Create content for Twitter, LinkedIn, Instagram, and more
- **Content Management:** Dashboard to view, update, and delete generated content
- **Twitter Integration:** Connect your Twitter account, post content directly, and manage authentication
- **Auto-Posting:** Optionally auto-post generated content to Twitter
- **Responsive UI:** Built with Next.js, React, and Tailwind CSS

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** Prisma ORM (see `/prisma/schema.prisma`)
- **Authentication:** Custom logic using cookies and secure session tokens
- **Twitter OAuth:** Twitter API v2 with OAuth 2.0 PKCE flow

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- Twitter Developer account (for API keys)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ai-content-writer.git
   cd ai-content-writer
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values (Twitter API keys, database URL, etc.)
   - Example:
     ```env
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     DATABASE_URL=your_database_url
     TWITTER_CLIENT_ID=your_twitter_client_id
     TWITTER_CLIENT_SECRET=your_twitter_client_secret
     TWITTER_REDIRECT_URI=http://localhost:3000/api/auth/twitter/callback
     ```
4. **Set up the database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
5. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment
- Deploy on [Vercel](https://vercel.com/) or any platform supporting Next.js
- Set environment variables in your deployment dashboard
- Make sure your Twitter app's callback URL matches your deployed domain (e.g., `https://yourdomain.com/api/auth/twitter/callback`)

## Folder Structure
```
ai-content-writer/
├── app/
│   ├── api/           # API routes (auth, content, twitter)
│   ├── dashboard/     # Dashboard page
│   ├── lib/           # Utility libraries (TwitterOAuth, prisma, etc.)
│   └── ...
├── components/        # Reusable React components
├── prisma/            # Prisma schema and migrations
├── public/            # Static assets
├── types/             # TypeScript types
├── package.json
├── tsconfig.json
└── ...
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

        
