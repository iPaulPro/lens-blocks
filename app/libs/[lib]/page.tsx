export default async function Page({ params }: { params: Promise<{ lib: string }> }) {
  const { lib } = await params;

  if (!lib) return null;

  switch (lib) {
    default:
      return <div>Library not found</div>;
  }
}
