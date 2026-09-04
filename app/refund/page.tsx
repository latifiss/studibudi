import type { Metadata } from 'next';
import PolicyPage from '@/components/ui/policyPage';

export const metadata: Metadata = {
  title: 'Refund Policy | Stidibudi',
  description: 'Read Stidibudi’s refund policy for paid subscriptions and services, including refund eligibility, cancellations, duplicate charges, and how to request a refund.',
  alternates: {
    canonical: '/refund',
  },
  openGraph: {
    title: 'Refund Policy | Stidibudi',
    description: 'Learn about Stidibudi’s refund eligibility, subscription cancellations, duplicate charges, and refund request process.',
    url: 'https://stidibudi.com/refund',
  },
};

const refundData = {
  title: 'Refund Policy',
  lastUpdated: '2026-09-04',
  sections: [
    {
      title: '1. Overview',
      content:
        'At Stidibudi, we want you to have a positive experience using our AI-powered quiz generator. This Refund Policy explains when you may be eligible for a refund for a paid purchase or subscription.',
    },
    {
      title: '2. Eligibility for Refunds',
      content:
        'Refund requests are considered when a significant technical issue prevents you from using a paid service as intended and the issue cannot reasonably be resolved. Refunds may also be considered when a payment was made in error or when you were charged more than once for the same purchase.',
    },
    {
      title: '3. Non-Refundable Situations',
      content:
        'We generally do not provide refunds for unused subscription time, unused quiz generations, or dissatisfaction with quiz results when the service is functioning as described. We may also decline requests for purchases made after the relevant subscription or billing period has been substantially used.',
    },
    {
      title: '4. Subscription Cancellations',
      content:
        'You may cancel a subscription at any time. Cancellation prevents future renewal where applicable, but it does not automatically create a refund for the current billing period. You will generally retain access to paid features until the end of the period you have already paid for, subject to the terms of your plan.',
    },
    {
      title: '5. Duplicate or Incorrect Charges',
      content:
        'If you believe you were charged twice for the same purchase or were charged an incorrect amount, please contact us as soon as possible. We will review the payment and, where appropriate, issue a refund for the duplicate or incorrect charge.',
    },
    {
      title: '6. How to Request a Refund',
      content:
        'To request a refund, contact us at issakalatif49@gmail.com with the email address associated with your Stidibudi account, the date of the payment, and a brief explanation of the issue. Please do not send passwords, full payment card numbers, or other sensitive payment information.',
    },
    {
      title: '7. Refund Review and Processing',
      content:
        'We review refund requests on a case-by-case basis. If a refund is approved, it will normally be returned to the original payment method. The time required for the refund to appear in your account may depend on your payment provider or financial institution.',
    },
    {
      title: '8. Changes to This Policy',
      content:
        'We may update this Refund Policy from time to time to reflect changes to our services, billing practices, or applicable requirements. Any updated version will be posted on this page with a revised last updated date.',
    },
    {
      title: '9. Contact Us',
      content:
        'If you have questions about this Refund Policy or a payment made through Stidibudi, contact us at issakalatif49@gmail.com.',
    },
  ],
  footer:
    'Please contact us as soon as possible if you believe a payment was made in error or you experienced a significant issue with a paid Stidibudi service.',
};

export default function RefundPage() {
  return <PolicyPage data={refundData} />;
}
