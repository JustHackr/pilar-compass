import { TkaGate } from "@/components/tka/TkaGate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <TkaGate requireAdmin>{children}</TkaGate>;
}
