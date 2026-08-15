import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type EnquiryContextValue = {
  items: string[];
  toggle: (name: string) => void;
  remove: (name: string) => void;
  clear: () => void;
  has: (name: string) => boolean;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  const toggle = useCallback((name: string) => {
    setItems((prev) => (prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]));
  }, []);
  const remove = useCallback((name: string) => {
    setItems((prev) => prev.filter((i) => i !== name));
  }, []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<EnquiryContextValue>(
    () => ({ items, toggle, remove, clear, has: (name) => items.includes(name) }),
    [items, toggle, remove, clear],
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used inside EnquiryProvider");
  return ctx;
}
