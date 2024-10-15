"use client";

import { Button, Card } from "flowbite-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <Card
        className="max-w-sm"
        imgAlt="Meaningful alt text for an image that is not purely decorative"
        imgSrc="/images/home.jpg"
      >
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Cryptography Project - Secure Messaging Protocol
        </h5>
        <div className="font-normal text-gray-700 dark:text-gray-400">

          <ul className="my-10">
            <li>Coria Martinez, Gustavo</li>
            <li>García Lemus, Rocío</li>
            <li>Morales Zilli, Luis Fernando</li>
            <li>Organista Alvarez, Ricardo</li>
            <li>Ríos Lira, Gamaliel</li>
          </ul>

          <Link href="/login" className="button">
            <Button className="w-full" size="sm" color="blue">Use the app</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}