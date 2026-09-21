import type { ImgHTMLAttributes } from "react";
export default function Image({
  fill,
  priority,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
}) {
  return <img {...props} />;
}
