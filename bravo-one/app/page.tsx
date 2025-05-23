"use client";

import Image from "next/image";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_700px_20px] items-center justify-items-center min-h-screen p-4 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="w-full flex justify-center items-center">
          <h1 className="text-4xl font-bold text-center">Bravo One</h1>
        </div>

        <Image
          src="/landing.jpg"
          alt="landing page"
          width={600}
          height={800}
          priority
        />
        <ul>
          <li>Handle your tenders, projects, and tasks in one place.</li>
          <li>
            Upload your documents, and we will extract the relevant information
            for you.
          </li>
          <li>Work with your tenders and tasks in the tender view.</li>
        </ul>

        {process.env.NEXT_PUBLIC_AUTH_ACTIVE === "true" && (
          <div className="w-full px-8 flex justify-between items-center gap-[24px]">
            <LoginLink>
              <Button>Login</Button>
            </LoginLink>
            <RegisterLink>
              <Button>Sign up</Button>
            </RegisterLink>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        Alpha 0.1.0
      </footer>
    </div>
  );
}
