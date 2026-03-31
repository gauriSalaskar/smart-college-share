export default function Terms() {
  return (
    <div className="page-container max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Terms & Conditions</h1>
        <p className="text-gray-500 text-sm">Last updated: January 2025</p>
      </div>

      <div className="card p-8 !hover:transform-none space-y-8">
        {[
          {
            title: '1. Acceptance of Terms',
            content: 'By accessing or using CampusShare ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the platform. These terms apply to all users including students, buyers, sellers, and administrators.',
          },
          {
            title: '2. Eligibility',
            content: 'CampusShare is intended exclusively for college and university students. By registering, you confirm that you are a currently enrolled student. The platform reserves the right to verify your student status and terminate accounts that do not meet this requirement.',
          },
          {
            title: '3. User Accounts',
            content: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information during registration. Each user may maintain only one account. You are responsible for all activities that occur under your account.',
          },
          {
            title: '4. Listings & Content',
            content: 'All listings are subject to admin review and approval before going public. You agree not to post listings that are illegal, stolen, counterfeit, misleading, or inappropriate. CampusShare reserves the right to remove any listing at any time without notice.',
          },
          {
            title: '5. Transactions',
            content: 'CampusShare facilitates transactions between students but is not a party to any transaction. All transactions are between buyers and sellers directly. CampusShare is not responsible for the quality, safety, or legality of items listed.',
          },
          {
            title: '6. Prohibited Activities',
            content: 'You agree not to: use the platform for any illegal purpose; harass or harm other users; post false or misleading information; attempt to hack or damage the platform; use automated bots or scrapers; or resell platform services without permission.',
          },
          {
            title: '7. Intellectual Property',
            content: '© 2025 CampusShare. All content on this platform including text, graphics, logos, and software is the property of CampusShare and is protected by applicable intellectual property laws. Unauthorized reproduction, distribution, or modification is strictly prohibited.',
          },
          {
            title: '8. Privacy',
            content: 'Your use of the platform is governed by our Privacy Policy. By using CampusShare, you consent to the collection and use of your information as described in the Privacy Policy. We do not sell your personal information to third parties.',
          },
          {
            title: '9. Limitation of Liability',
            content: 'CampusShare is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform. We do not guarantee the availability, accuracy, or reliability of the platform at all times.',
          },
          {
            title: '10. Contact Us',
            content: 'If you have any questions about these Terms & Conditions, please contact us at campusshare@college.edu.',
          },
        ].map(section => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-white mb-3">{section.title}</h2>
            <p className="text-gray-400 leading-relaxed text-sm">{section.content}</p>
          </div>
        ))}

        <div className="pt-4 border-t border-surface-border">
          <p className="text-gray-600 text-xs text-center">
            © 2025 CampusShare. All rights reserved. Unauthorized use or reproduction is strictly prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}