import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    setTransitioning(true);
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setTransitioning(false);
    }, 100);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div
      className={`min-h-screen bg-white-off transition-opacity duration-200 ease-out ${
        transitioning ? "opacity-0" : "opacity-100"
      }`}
    >
      {displayChildren}
    </div>
  );
}
