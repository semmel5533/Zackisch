import { useEffect, useState, type ComponentType } from "react";

export default function dynamic(
  loader: () => Promise<{ default: ComponentType } | ComponentType>,
): ComponentType {
  return (props) => {
    const [Component, setComponent] = useState<ComponentType | null>(null);
    useEffect(() => {
      let active = true;
      loader().then((result) => {
        if (active)
          setComponent(() =>
            result && typeof result === "object" && "default" in result
              ? result.default
              : result,
          );
      });
      return () => { active = false; };
    }, []);
    return Component ? <Component {...props} /> : null;
  };
}
