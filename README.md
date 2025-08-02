This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# 🚀 Next.js UUID4 Project

A Next.js project that utilizes **UUID4** for generating unique identifiers.

## 📌 What is UUID4?

UUID4 (Universally Unique Identifier v4) is a **randomly generated 128-bit identifier**. It ensures uniqueness in distributed systems and is commonly used for:
- Database primary keys.
- Unique user/session tokens.
- Identifying resources in APIs.

A UUID4 example:
`"4a3f4a3f-4a3f-4a3f

# 🚀 Convex Project

A modern backend-as-a-service (BaaS) for building real-time, serverless applications.

## 📌 Features
- **Serverless Backend** - No need to manage backend infrastructure.
- **Realtime Data** - Automatically syncs data across clients.
- **Scalable Database** - A transactional, document-based database.
- **TypeScript & JavaScript Support** - Strongly-typed API for a smooth developer experience.
- **Secure & Fast** - Built-in authentication and access control.

---

## 📦 Installation

### 1️⃣ Install Convex CLI
```sh
npm install -g convex

```

# 🔐 Google Authentication with Next.js

This project demonstrates how to integrate **Google OAuth Authentication** in a **Next.js** application using the `react-oauth/google` package.

---

## 🚀 Features
✅ **Google OAuth Login** using `useGoogleLogin`.  
✅ **Fetch User Info** from Google's API.  
✅ **Store User Data** in a database.  
✅ **Save User Session** in `localStorage`.  
✅ **Close Authentication Dialog** upon success.  

---

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/nextjs-google-auth.git
cd nextjs-google-auth

command line

npm install axios uuid @react-oauth/google
# OR
yarn add axios uuid @react-oauth/google

```

# 🎨 shadcn/ui - A Modern UI Component Library for React

**shadcn/ui** is a collection of customizable, accessible, and **server-friendly** UI components built with **Radix UI**, **Tailwind CSS**, and **React**.  

It provides a **headless** design approach, meaning you can style components as needed while maintaining **great accessibility** and **performance**.

---

## 🚀 Features

✅ **Customizable** - Fully controllable Tailwind CSS-based components.  
✅ **Accessible** - Uses Radix UI for WAI-ARIA compliance.  
✅ **Server-Optimized** - Works perfectly in server components.  
✅ **No External CSS** - Styles are integrated with Tailwind CSS.  
✅ **Lightweight & Fast** - No extra dependencies for styling.  
✅ **Dark Mode Support** - Built-in dark mode compatibility.  

---

## 📦 Installation

### **1️⃣ Install the CLI**
First, install `shadcn/ui` CLI in your Next.js or React project:

```sh
npx shadcn-ui@latest init


```



# 🧠 My Markdown Blog (Next.js + React Markdown)

This is a simple blog-style application built with **Next.js** and **React Markdown**. It allows rendering of Markdown content inside React components, making it perfect for blogs, documentation, or knowledge base apps.

---

## 🚀 Features

- ⚡ Built with **Next.js**
- 📝 Supports **Markdown rendering** using `react-markdown`
- 🎨 Styled with Tailwind CSS (optional)
- 📦 Easy to extend for a full blog or documentation platform

---

## 🛠️ Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/markdown-blog.git
cd markdown-blog

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

```
import ReactMarkdown from 'react-markdown';

const markdown = `
# Hello, world!

This is a **markdown** block with [a link](https://nextjs.org).
`;

export default function Home() {
  return <ReactMarkdown>{markdown}</ReactMarkdown>;
}
```

```
my-app/
├── pages/
│   └── index.js
├── components/
├── public/
├── styles/
├── package.json
└── README.md
```





layout 

import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider"
import ConvexClientProvider from "./ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body >
        <ConvexClientProvider >
        <Provider>
        {children}
        </Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}







export const people = [
        {
          id: 1,
          name: "Satendra Sharma",
          designation: "Software Engineer GenAi",
          image: 'https://avatar.iran.liara.run/public/36',
        },
        {
          id: 2,
          name: "Shivendra Pateriya",
          designation: "Product Manager",
          image:'https://avatar.iran.liara.run/public/18',
        },
        {
          id: 3,
          name: "Mohmmad Rehan",
          designation: "Software Engineer GenAi",
          image:'https://avatar.iran.liara.run/public/22',
        },
        {
          id: 4,
          name: "Nami Jain",
          designation: "UX Designer",
          image: 'https://avatar.iran.liara.run/public/69',
        },
        
      ];