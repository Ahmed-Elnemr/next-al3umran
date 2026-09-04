import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
