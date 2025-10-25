import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Editor } from "@tiptap/core";
import { Account } from "@lens-protocol/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york/ui/avatar";
import { parseUri, truncateAddress } from "@/registry/new-york/lib/lens-utils";
import { UserCircle2 } from "lucide-react";

interface IProps {
  editor: Editor;
  items: Array<Account>;
  command: any;
}

export const LensMentionsList: FC<IProps> = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollContainer = useRef<HTMLDivElement>(null);

  const containerPaddingTop = scrollContainer.current
    ? parseInt(window.getComputedStyle(scrollContainer.current).paddingTop, 10)
    : 0;
  const containerPaddingBottom = scrollContainer.current
    ? parseInt(window.getComputedStyle(scrollContainer.current).paddingBottom, 10)
    : 0;

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item.username?.value });
    }
  };

  const upHandler = () => {
    let index = (selectedIndex + props.items.length - 1) % props.items.length;
    setSelectedIndex(index);
    scrollToItem(index);
  };

  const downHandler = () => {
    let index = (selectedIndex + 1) % props.items.length;
    setSelectedIndex(index);
    scrollToItem(index);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  const scrollToItem = (index: number) => {
    const container = scrollContainer.current;
    const item = container?.children[index] as HTMLElement;
    if (item && container) {
      const itemOffsetTop = item.offsetTop;
      const itemOffsetHeight = item.offsetHeight;
      const containerScrollTop = container.scrollTop;
      const containerOffsetHeight = container.clientHeight;

      if (itemOffsetTop < containerScrollTop + containerPaddingTop) {
        container.scrollTop = itemOffsetTop - containerPaddingTop;
      } else if (
        itemOffsetTop + itemOffsetHeight >
        containerScrollTop + containerOffsetHeight - containerPaddingBottom
      ) {
        container.scrollTop = itemOffsetTop + itemOffsetHeight - containerOffsetHeight + containerPaddingBottom;
      }
    }
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  if (!props.items.length) {
    return null;
  }

  return (
    <div
      ref={scrollContainer}
      className="w-60 flex flex-col gap-2 overflow-auto p-1 relative border rounded-xl bg-background shadow-lg max-h-64 overscroll-y-auto"
    >
      {props.items.map((item, index) => (
        <div
          className={`flex items-center gap-x-2 pl-2 py-2 min-w-48 cursor-pointer rounded-lg ${index === selectedIndex ? "bg-accent" : ""}`}
          key={index}
          onClick={() => selectItem(index)}
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={parseUri(item.metadata?.picture)} alt={"@" + item.username?.localName} />
            <AvatarFallback className="bg-black">
              <UserCircle2 className="opacity-45" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col w-full min-w-0">
            <div className="text-base font-bold -mb-0.5 truncate">
              {item.metadata?.name
                ? item.metadata?.name
                : item.username
                  ? "@" + item.username.localName
                  : truncateAddress(item.address, 12)}
            </div>
            {item.metadata?.name && item.username ? (
              <div className="text-sm text-gray-600 truncate">{"@" + item.username.value.replace("lens/", "")}</div>
            ) : (
              <div className="text-sm text-gray-600">{truncateAddress(item.address, 12)}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});
