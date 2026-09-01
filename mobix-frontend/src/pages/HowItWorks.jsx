import './HowItWorks.css'

const STEPS_BUYER = [
  {
    icon: 'ti-search',
    title: 'Search & Browse',
    desc: 'Search by category, city, or price range. Filter by condition to find exactly what you need.'
  },
  {
    icon: 'ti-shield-check',
    title: 'Check the listing',
    desc: 'Every listing shows condition grade, seller rating, and verification badges so you know what you are getting.'
  },
  {
    icon: 'ti-message',
    title: 'Contact the seller',
    desc: 'Message the seller directly through Mobix. Ask questions, negotiate, and arrange meetup or delivery.'
  },
  {
    icon: 'ti-star',
    title: 'Leave a review',
    desc: 'After the transaction, leave a review for the seller. This helps build trust for the whole community.'
  }
]

const STEPS_SELLER = [
  {
    icon: 'ti-user-plus',
    title: 'Create an account',
    desc: 'Sign up with your email and phone number. Verify your phone to get started.'
  },
  {
    icon: 'ti-camera-plus',
    title: 'Post your listing',
    desc: 'Fill in your device details, select a condition grade, upload at least 2 photos, and set your price.'
  },
  {
    icon: 'ti-bell',
    title: 'Get notified',
    desc: 'Buyers will message you directly. Respond quickly to increase your chances of selling fast.'
  },
  {
    icon: 'ti-cash',
    title: 'Complete the sale',
    desc: 'Meet the buyer safely, hand over the device, and mark your listing as sold.'
  }
]

const CONDITIONS = [
  { grade: 'Like New', color: '#22C55E', desc: 'No scratches, original accessories, under 3 months old' },
  { grade: 'Excellent', color: '#3B82F6', desc: 'Minor signs of use, fully functional, all accessories included' },
  { grade: 'Good', color: '#F59E0B', desc: 'Visible wear but fully functional, may lack some accessories' },
  { grade: 'Fair', color: '#F97316', desc: 'Noticeable damage or missing parts, functional with caveats' },
  { grade: 'For Parts', color: '#F43F5E', desc: 'Not fully functional, sold as-is for repair or parts' },
]

const TRUST_ITEMS = [
  { icon: 'ti-shield-check', title: 'IMEI Verification', desc: 'We check every listed phone against stolen and blacklisted device databases.' },
  { icon: 'ti-user-check', title: 'Seller Verification', desc: 'Sellers verify their phone number. CNIC verification coming soon for extra trust.' },
  { icon: 'ti-rosette', title: 'Condition Grading', desc: 'Our 5-tier grading system sets clear expectations so there are no surprises.' },
  { icon: 'ti-lock', title: 'Escrow Payments', desc: 'Coming soon — pay through Mobix and funds are only released when you confirm receipt.' },
]

const FAQS = [
  { q: 'Is Mobix free to use?', a: 'Yes, listing and browsing is completely free. We will introduce optional paid features like featured listings in the future.' },
  { q: 'How do I know if a phone is stolen?', a: 'We run IMEI checks on listed phones to verify they are not blacklisted or reported stolen.' },
  { q: 'What if I get scammed?', a: 'Report any suspicious listing immediately using the Report button. Our team reviews all reports within 24 hours.' },
  { q: 'Can dealers list on Mobix?', a: 'Yes, small phone shops and dealers are welcome. Verified Dealer accounts are coming soon with extra features.' },
  { q: 'Which cities are supported?', a: 'Mobix currently covers all major cities in Pakistan including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, and Peshawar.' },
]

export default function HowItWorks() {
  return (
    <div className="hiw-page">

      <section className="hiw-hero">
        <div className="hiw-hero-inner">
          <div className="hiw-badge">How it works</div>
          <h1 className="hiw-title">Buying and selling made <span>safe</span></h1>
          <p className="hiw-sub">Mobix is built around trust. Here's everything you need to know to buy and sell with confidence.</p>
        </div>
      </section>

      <div className="hiw-inner">

        <section className="hiw-section">
          <h2 className="hiw-section-title">
            <i className="ti ti-shopping-cart" /> For buyers
          </h2>
          <div className="steps-grid">
            {STEPS_BUYER.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{i + 1}</div>
                <div className="step-icon"><i className={`ti ${step.icon}`} /></div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="hiw-section">
          <h2 className="hiw-section-title">
            <i className="ti ti-tag" /> For sellers
          </h2>
          <div className="steps-grid">
            {STEPS_SELLER.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{i + 1}</div>
                <div className="step-icon"><i className={`ti ${step.icon}`} /></div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="hiw-section">
          <h2 className="hiw-section-title">
            <i className="ti ti-rosette" /> Condition grading system
          </h2>
          <p className="hiw-section-sub">Every listing on Mobix uses our standardized 5-tier condition grading system so buyers always know what to expect.</p>
          <div className="conditions-list">
            {CONDITIONS.map((c, i) => (
              <div key={i} className="condition-row">
                <div className="condition-grade" style={{ color: c.color, borderColor: c.color }}>
                  {c.grade}
                </div>
                <div className="condition-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="hiw-section">
          <h2 className="hiw-section-title">
            <i className="ti ti-shield" /> How we keep you safe
          </h2>
          <div className="trust-grid">
            {TRUST_ITEMS.map((item, i) => (
              <div key={i} className="trust-card">
                <div className="trust-card-icon">
                  <i className={`ti ${item.icon}`} />
                </div>
                <div className="trust-card-title">{item.title}</div>
                <div className="trust-card-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="hiw-section">
          <h2 className="hiw-section-title">
            <i className="ti ti-help-circle" /> Frequently asked questions
          </h2>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <div className="faq-q"><i className="ti ti-circle-dot" /> {faq.q}</div>
                <div className="faq-a">{faq.a}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}