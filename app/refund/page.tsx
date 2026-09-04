import type { Metadata } from 'next';
import refundData from '@/data/refund.json';
import PolicyPage from '@/components/ui/policyPage';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Read Stidibudi’s refund policy for paid subscriptions and services, including refund eligibility, cancellations, and how to request a refund.',
  alternates: { canonical: '/refund' },
  openGraph: {
    title: 'Refund Policy | Stidibudi',
    description: 'Learn about Stidibudi’s refund eligibility, subscription cancellations, and refund request process.',
    url: 'https://stidibudi.com/refund',
  },
};

export default function RefundPage() {
  return <PolicyPage data={refundData} />;
}
