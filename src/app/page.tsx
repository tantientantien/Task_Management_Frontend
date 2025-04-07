import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="center">
      <SignIn routing="hash" />
    </div>
  );
}
