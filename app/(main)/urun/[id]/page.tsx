import { UrunDetail } from './_components/urun-detail';

export default async function UrunPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UrunDetail productId={id} />;
}
