import UseAuthenticatedAccount from "@/components/use-authenticated-account";
import UseLoginWithViem from "@/components/use-login-with-viem";
import UsePostContext from "@/components/use-post-context";
import UseReactionToggle from "@/components/use-reaction-toggle";

export default async function Page({ params }: { params: Promise<{ hook: string }> }) {
  const { hook } = await params;

  if (!hook) return null;

  switch (hook) {
    case "use-authenticated-account":
      return <UseAuthenticatedAccount />;
    case "use-login-with-viem":
      return <UseLoginWithViem />;
    case "use-post-context":
      return <UsePostContext />;
    case "use-reaction-toggle":
      return <UseReactionToggle />;
    default:
      return <div>Hook not found</div>;
  }
}
