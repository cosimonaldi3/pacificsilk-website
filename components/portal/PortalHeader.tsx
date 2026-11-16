import Link from "next/link";
import Container from "@/components/ui/Container";
import Logo from "@/components/Logo";
import SignOutButton from "./SignOutButton";

// Portal top bar. Same shell as the marketing Nav (components/ui/Nav.tsx):
// sticky, warm background, logo left. Site links are left out on purpose:
// inside the portal the only action is signing out.
export default function PortalHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-psc-border bg-psc-bg/95 backdrop-blur-sm">
      <Container className="flex items-center justify-between h-16">
        <Link
          href="/"
          aria-label="Pacific Silk Consulting — home"
          className="hover:opacity-80 transition flex items-center"
        >
          <Logo variant="psc-horizontal-black" width={160} priority className="h-8 w-auto" />
        </Link>
        <SignOutButton />
      </Container>
    </header>
  );
}
