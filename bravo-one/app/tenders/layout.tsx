import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenders",
  description: "Tenders in app",
};

export default function ListsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <div className="flex flex-col justify-center items-center">
        <div className="pl-1 pr-1 md:min-w-3xl min-w-sm">{children}</div>
      </div>
    </section>
  );
}
