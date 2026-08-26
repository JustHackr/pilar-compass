import { TkaGate } from "@/components/tka/TkaGate";

export default function OsnLayout({ children }: { children: React.ReactNode }) {
  return <TkaGate>{children}</TkaGate>;
}
