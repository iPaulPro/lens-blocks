import UseAuthenticatedAccount from "@/components/use-authenticated-account";
import UseLoginWithViem from "@/components/use-login-with-viem";
import UsePostContext from "@/components/use-post-context";

export default async function Page({ params }: { params: Promise<{ hook: string }> }) {
  const { hook } = await params;

  if (!hook) return null;

  switch (hook) {
    case "use-authenticated-lens-account":
      return <UseAuthenticatedAccount />;
    case "use-lens-login-with-viem":
      return <UseLoginWithViem />;
    case "use-lens-post-context":
      return <UsePostContext />;
    default:
      return <div>Hook not found</div>;
  }
}
