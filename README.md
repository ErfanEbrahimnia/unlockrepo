# 🔐 UnlockRepo

A small tool to automate the process of granting access to your private repositories once a purchase is made on Gumroad

[Live demo](https://unlockrepo.com)

## 👨‍💻 The Stack

UnlockRepo is built with:

- [Nextjs 14](https://nextjs.org/)
- [shadcn-ui](https://ui.shadcn.com)
- [TailwindCSS](https://tailwindcss.com)
- [Lucia](https://lucia-auth.com/)
- [Kysely](https://kysely.dev/)
- [@t3-oss/env-nextjs](https://env.t3.gg/)
- Hosted on [Vercel](https://vercel.com/)

## 🛠️ Self-hosting UnlockRepo

Deploying UnlockRepo is Pretty straightforward:

1. Clone this repository
2. Deploy to Vercel using `npx vercel deploy --prod`
3. Set up a new Postgres database
4. Register a new [Gumroad OAuth application](https://app.gumroad.com/settings/advanced#application-form)
5. Register a new [Github OAuth application](https://github.com/settings/developers)
6. Check the [.env.example](https://github.com/ErfanEbrahimnia/unlockrepo/blob/main/.env.example) file and add the env keys in Vercel

## ⚙️ Running UnlockRepo locally

To run UnlockRepo locally, you need Node.js > 18.20.4 and Postgres installed.

1. Clone this repository
2. Run `npm install` to install the dependencies
3. Copy [.env.example](https://github.com/ErfanEbrahimnia/unlockrepo/blob/main/.env.example), rename it to .env.local and replace the values.
4. Run `npm run dev`

---

Feel free to reach out to me through email at erfan@nextjsweekly.com or on [on Twitter](https://x.com/ErfanEbrahimnia) if you have any questions or feedback! Hope you find this useful 😊
