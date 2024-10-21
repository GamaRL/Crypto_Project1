"use client";

import { Label, TextInput } from "flowbite-react";
import { HiMail, HiKey } from "react-icons/hi";

export default function SecretInput() {
  return (
    <div className="max-w-md">
      <div className="mb-2 block">
        <Label htmlFor="email4" value="The secret for this chat..." />
      </div>
      <TextInput id="email4" type="email" icon={HiKey} placeholder="Insert the key" required />
    </div>
  );
}
