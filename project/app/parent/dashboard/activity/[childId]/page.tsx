import ChildActivityClient from '@/components/dashboard/ChildActivityClient';

export async function generateStaticParams() {
  // Generate static params for known child IDs
  return [
    { childId: '1' },
    { childId: '2' },
    { childId: '3' },
  ];
}

interface PageProps {
  params: {
    childId: string;
  };
}

export default function ChildActivityPage({ params }: PageProps) {
  return <ChildActivityClient childId={params.childId} />;
}