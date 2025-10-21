import UseAuthenticatedAccount from "@/components/use-authenticated-account";
import UseLoginWithViem from "@/components/use-login-with-viem";
import UsePostContext from "@/components/use-post-context";
import UseReactionToggle from "@/components/use-reaction-toggle";
import UseTipPostAction from "@/components/use-tip-post-action";
import UseTipAccountAction from "@/components/use-tip-account-action";

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
    case "use-tip-post-action":
      return <UseTipPostAction />;
    case "use-tip-account-action":
      return <UseTipAccountAction />;
    default:
      return <div>Hook not found</div>;
  }
}
