import type { ImgHTMLAttributes } from "react";
export default function Image({
  fill,
  priority,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
}) {
  return (
    <img
      {...props}
      style={{
        ...props.style,
        ...(fill
          ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
          : {}),
      }}
    />
  );
}
