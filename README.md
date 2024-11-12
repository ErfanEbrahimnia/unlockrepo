![unlockrepo_header](https://github.com/user-attachments/assets/2e5390c6-4a21-40a1-9e21-c5c63e369feb)

# 🔐 UnlockRepo

A simple tool to automate and monetize granting access to your private repositories after a purchase is made on Gumroad.

[Live demo](https://unlockrepo.com)

## 👨‍💻 Tech Stack

UnlockRepo is built using:

- [Next.js 14](https://nextjs.org/)
- [shadcn-ui](https://ui.shadcn.com)
- [TailwindCSS](https://tailwindcss.com)
- [Lucia](https://lucia-auth.com/)
- [Kysely](https://kysely.dev/)
- [@t3-oss/env-nextjs](https://env.t3.gg/)
- Hosted on [Vercel](https://vercel.com/)

## 🛠️ Self-Hosting UnlockRepo

Deploying UnlockRepo is straightforward:

1. Clone this repository.
2. Deploy to Vercel using `npx vercel deploy --prod`.
3. Set up a new Postgres database.
4. Register a [Gumroad OAuth application](https://app.gumroad.com/settings/advanced#application-form).
5. Register a [GitHub OAuth application](https://github.com/settings/developers).
6. Refer to the [.env.example](https://github.com/ErfanEbrahimnia/unlockrepo/blob/main/.env.example) file and add the environment keys in Vercel.

## ⚙️ Running UnlockRepo Locally

To run UnlockRepo locally, make sure you have Node.js > 18.20.4 and Postgres installed.

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Copy [.env.example](https://github.com/ErfanEbrahimnia/unlockrepo/blob/main/.env.example), rename it to `.env.local`, and update the values as needed.
4. Run `npm run dev`.

---

Feel free to reach out at erfan@nextjsweekly.com or [on Twitter](https://x.com/ErfanEbrahimnia) with any questions or feedback. Hope you find this useful! 😊
