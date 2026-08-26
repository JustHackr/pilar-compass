import { TkaGate } from "@/components/tka/TkaGate";

export default function MateriLayout({ children }: { children: React.ReactNode }) {
  return <TkaGate>{children}</TkaGate>;
}
