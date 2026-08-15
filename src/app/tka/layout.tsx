import { TkaGate } from "@/components/tka/TkaGate";

export default function TkaLayout({ children }: { children: React.ReactNode }) {
  return <TkaGate>{children}</TkaGate>;
}
