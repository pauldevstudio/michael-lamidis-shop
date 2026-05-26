"use client";

import { createContext, useContext } from "react";
import type { SiteContent } from "./site-content";

const ContentContext = createContext<SiteContent | null>(null);

export function ContentProvider({
  children,
  content,
}: {
  children: React.ReactNode;
  content: SiteContent;
}) {
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

/** Returns site content from context, or null when no provider is mounted. */
export function useContent(): SiteContent | null {
  return useContext(ContentContext);
}
