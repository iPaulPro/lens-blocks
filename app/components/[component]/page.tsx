import AccountListItem from "@/components/account-list-item";
import PaginatedList from "@/components/paginated-list";
import LoginButton from "@/components/login-button";
import TextEditor from "@/components/text-editor";
import Markdown from "@/components/markdown";
import AudioPlayer from "@/components/audio-player";
import VideoPlayer from "@/components/video-player";
import FollowButton from "@/components/follow-buton";
import LinkPreviewPage from "@/components/link-preview";

export async function generateMetadata({ params }: { params: { block: string } }) {
  const { block } = params;

  const titleMap: Record<string, string> = {
    "account-list-item": "Account List Item",
    "audio-player": "Audio Player",
    "follow-button": "Follow Button",
    "login-button": "Login Button",
    "paginated-list": "Paginated List",
    "text-editor": "Text Editor",
    "lens-markdown": "Lens Markdown",
    "link-preview": "Link Preview",
    "video-player": "Video Player",
  };

  const descriptionMap: Record<string, string> = {
    "account-list-item":
      "A shadcn/ui component that displays a Lens Account in a list item layout using the Lens React SDK.",
    "audio-player":
      "A shadcn/ui component that displays an audio player for attachments in Lens Posts using the Lens React SDK.",
    "follow-button":
      "A shadcn/ui button component for following and un-following Lens Accounts using the Lens React SDK.",
    "login-button": "A shadcn/ui button component for logging in with Lens using the Lens React SDK.",
    "paginated-list": "A shadcn/ui component that displays a paginated list of items from the Lens React SDK.",
    "text-editor":
      "A shadcn/ui component text editor for composing Lens Posts, with mentions and markdown support, using the Lens React SDK.",
    "lens-markdown": "A shadcn/ui component that displays markdown and mentions using the Lens React SDK.",
    "link-preview": "A shadcn/ui component that displays a link preview for links in Lens Posts.",
    "video-player":
      "A shadcn/ui component that displays a video player for attachments in Lens Posts using the Lens React SDK.",
  };

  return {
    title: titleMap[block] ? titleMap[block] + " - Lens Blocks" : "Lens Blocks",
    description:
      descriptionMap[block] ||
      "A registry of useful social building blocks using the official Lens React SDK, wagmi, and shadcn/ui components.",
  };
}

export default async function Page({ params }: { params: Promise<{ component: string }> }) {
  const { component } = await params;

  if (!component) return null;

  switch (component) {
    case "account-list-item":
      return <AccountListItem />;
    case "audio-player":
      return <AudioPlayer />;
    case "follow-button":
      return <FollowButton />;
    case "login-button":
      return <LoginButton />;
    case "paginated-list":
      return <PaginatedList />;
    case "text-editor":
      return <TextEditor />;
    case "lens-markdown":
      return <Markdown />;
    case "link-preview":
      return <LinkPreviewPage />;
    case "video-player":
      return <VideoPlayer />;
    default:
      return <div>Component not found</div>;
  }
}
