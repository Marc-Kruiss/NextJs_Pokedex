export default function PokemonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="m-4 p-4 border-red-500 border-[16px]">{children}</main>
  );
}
