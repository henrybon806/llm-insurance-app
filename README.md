Hi, My name is Henry Bonomolo and I am a Computer Science Major at UC Berkeley.
This project is an example Insurance Claim Parser using the ChatGPT to parse for names.

## SETUP

In order to run this project you need to first set up an .env.local file.

You will need to include the API Key with this variable name 'NEXT_PUBLIC_OPENAI_API_KEY'

In order to run the project you will need to run npm install, and then npm run dev. The project will automatically be set for localhost:3000.

From there you can use it by dragging any files into it, and it will either tell you the ID or will ask you to manually input the ID.

## Architecture Notes:

This app is built with Next.js and is split into a frontend and backend. On the frontend, users can drag and drop insurance claim files, which get turned into plain text. That text is sent to the backend, where we use OpenAI to figure out who the primary insured is by searching for pretty much anything that seems relevant using a constant prompt. Once we get a name back, we compare it to a list of known companies using a fuzzy string matching algorithm with data kept within the project. If the match isn’t close enough, the user gets to pick from a dropdown list manually.

All sensitive logic, like the OpenAI API key, stays on the server so nothing gets exposed in the browser. I use environment variables to keep things flexible between development and production and for everyone to be able to run the project with their own API key. The app is pretty easy to expand — we could add login, better error handling, or even database storage without much trouble – due to the modular design and simple UI. I chose to use CSS rather than Tailwind for the simplicity and control it offers. Since this project isn’t too complex in terms of styling, plain CSS felt quicker and more straightforward without needing to learn or manage utility classes.

## NEXT.JS read me

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
