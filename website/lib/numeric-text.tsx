import { Children, cloneElement, isValidElement, type ReactNode } from "react";

/** Keep words and units in Poppins, including inside localized rich text. */
export function numericText(content: ReactNode): ReactNode {
  return Children.map(content, (child) => {
    if (typeof child === "string") {
      const parts: ReactNode[] = [];
      let cursor = 0;
      for (const match of child.matchAll(/\d+(?:[.,]\d+)*/g)) {
        parts.push(child.slice(cursor, match.index));
        parts.push(
          <span key={match.index} className="font-inter tabular-nums">
            {match[0]}
          </span>,
        );
        cursor = match.index + match[0].length;
      }
      parts.push(child.slice(cursor));
      return parts;
    }
    if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.props.children
    ) {
      return cloneElement(child, {}, numericText(child.props.children));
    }
    return child;
  });
}
