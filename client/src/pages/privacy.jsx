export default function Privacy() {
  return (
    <div className="page-container max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm">Last updated: January 2025</p>
      </div>

      <div className="card p-8 !hover:transform-none space-y-8">
        {[
          {
            title: '1. Information We Collect',
            content: 'We collect information you provide directly: name, email address, phone number, college name, and password (encrypted). We also collect usage data such as listings viewed, messages sent, and transactions made. Images you upload are stored securely on Cloudinary.',
          },
          {
            title: '2. How We Use Your Information',
            content: 'We use your information to: provide and improve the platform; authenticate your identity; display your listings and profile; send notifications about your account; process transactions; and ensure platform safety through admin moderation.',
          },
          {
            title: '3. Information Sharing',
            content: 'We do not sell, trade, or rent your personal information to third parties. Your contact details are only shown to other users based on your chosen contact preference setting on each listing. Admin users can view all user information for moderation purposes.',
          },
          {
            title: '4. Data Security',
            content: 'We implement industry-standard security measures including: bcrypt password hashing (12 rounds); JWT-based authentication with expiry; HTTPS encryption for all data transmission; MongoDB Atlas security with IP whitelisting; and Cloudinary secure image storage.',
          },
          {
            title: '5. Cookies',
            content: 'CampusShare uses minimal cookies and local storage to maintain your login session. We do not use tracking cookies or third-party advertising cookies. You can clear your browser storage at any time to log out.',
          },
          {
            title: '6. Your Rights',
            content: 'You have the right to: access your personal data; correct inaccurate information; delete your account and associated data; opt out of non-essential communications; and request a copy of your data. Contact us at campusshare@college.edu to exercise these rights.',
          },
          {
            title: '7. Data Retention',
            content: 'We retain your account data as long as your account is active. Deleted listings are removed from public view immediately. If you delete your account, your personal data will be removed within 30 days. Transaction records may be retained for legal compliance.',
          },
          {
            title: '8. Third-Party Services',
            content: 'We use the following third-party services: MongoDB Atlas (database), Cloudinary (image storage), Render (backend hosting), and Vercel (frontend hosting). Each service has its own privacy policy and security measures.',
          },
          {
            title: '9. Changes to This Policy',
            content: 'We may update this Privacy Policy from time to time. We will notify you of any significant changes via email or a prominent notice on the platform. Your continued use after changes constitutes acceptance of the new policy.',
          },
          {
            title: '10. Contact Us',
            content: 'If you have any questions about this Privacy Policy, please contact us at campusshare@college.edu.',
          },
        ].map(section => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-white mb-3">{section.title}</h2>
            <p className="text-gray-400 leading-relaxed text-sm">{section.content}</p>
          </div>
        ))}

        <div className="pt-4 border-t border-surface-border">
          <p className="text-gray-600 text-xs text-center">
            © 2025 CampusShare. All rights reserved. Your privacy is important to us.
          </p>
        </div>
      </div>
    </div>
  );
}