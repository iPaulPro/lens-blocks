import AccountListItem from "@/components/account-list-item";
import PaginatedList from "@/components/paginated-list";
import AccountListItemSkeleton from "@/components/account-list-item-skeleton";
import LoginButton from "@/components/login-button";
import AccountChooser from "@/components/account-chooser";
import TextEditor from "@/components/text-editor";
import Markdown from "@/components/markdown";
import AudioPlayer from "@/components/audio-player";
import VideoPlayer from "@/components/video-player";
import TipDialog from "@/components/tip-dialog";
import FollowButton from "@/components/follow-buton";
import LinkPreviewPage from "@/components/link-preview";
import CollectDialog from "@/components/collect-dialog";
import QuoteDialog from "@/components/quote-dialog";

export default async function Page({ params }: { params: Promise<{ component: string }> }) {
  const { component } = await params;

  if (!component) return null;

  switch (component) {
    case "account-chooser":
      return <AccountChooser />;
    case "account-list-item":
      return <AccountListItem />;
    case "account-list-item-skeleton":
      return <AccountListItemSkeleton />;
    case "audio-player":
      return <AudioPlayer />;
    case "collect-dialog":
      return <CollectDialog />;
    case "follow-button":
      return <FollowButton />;
    case "login-button":
      return <LoginButton />;
    case "paginated-list":
      return <PaginatedList />;
    case "quote-dialog":
      return <QuoteDialog />;
    case "text-editor":
      return <TextEditor />;
    case "lens-markdown":
      return <Markdown />;
    case "link-preview":
      return <LinkPreviewPage />;
    case "tip-dialog":
      return <TipDialog />;
    case "video-player":
      return <VideoPlayer />;
    default:
      return <div>Component not found</div>;
  }
}
