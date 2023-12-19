export interface MessageItemSystemProps {
  senderName: string;
  content: string;
}

export const MessageItemSystem = ({
  content,
  senderName,
}: MessageItemSystemProps) => {
  return (
    <div className="mx-auto">
      <span className="text-sm font-light text-colors-neutral-500">
        {senderName + ' '}
        <div
          className="inline-block"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </span>
    </div>
  );
};
