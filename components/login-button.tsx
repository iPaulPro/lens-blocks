"use client";

import { CodeBlock } from "@/components/codeblock";
import { LensLoginButton } from "@/registry/new-york/components/account/lens-login-button";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/registry/new-york/ui/alert";
import { Blocks } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";
import Link from "next/link";
import { InstallCommandBlock } from "@/components/install-command-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs";

export default function LoginButton() {
  const handleClick = () => toast.success("Login button clicked");
  return (
    <>
      <div className="flex flex-col flex-1 gap-8">
        <Tabs defaultValue="preview">
          <div className="preview flex flex-col gap-2 relative">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="preview" className="flex items-center justify-center flex-grow relative">
              <LensLoginButton onClick={handleClick} />
            </TabsContent>
            <TabsContent value="code" className="p-0">
              <CodeBlock lang="tsx" className="lines border-none">
                {`import { LensLoginButton } from "@/components/account/lens-login-button";
import { toast } from "sonner";

export function LensLoginButtonDemo() {
  const handleClick = () => toast.success("Login button clicked");
  return <LensLoginButton onClick={handleClick} />;
};`}
              </CodeBlock>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <Alert className="bg-foreground text-background">
        <Blocks className="!size-5" />
        <AlertTitle className="text-lg">Looking for a full login flow?</AlertTitle>
        <AlertDescription className="text-background opacity-80">
          This is just a button component. If you want a complete login flow with wallet connection and account
          selection, use the Login Block.
        </AlertDescription>
        <div className="col-start-2 grid flex justify-items-end">
          <Button className="w-fit mt-4" variant="secondary" asChild>
            <Link href="/blocks/login">Login Block</Link>
          </Button>
        </div>
      </Alert>
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="login-button" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <CodeBlock lang="tsx" className="lines">
        {`import { LensLoginButton } from "@/components/account/lens-login-button";`}
      </CodeBlock>
      <CodeBlock lang="tsx" className="lines">
        {`<LensLoginButton />`}
      </CodeBlock>
    </>
  );
}
