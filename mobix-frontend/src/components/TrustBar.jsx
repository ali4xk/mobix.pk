import './TrustBar.css'

const TRUST_ITEMS = [
  { icon: 'ti-shield-check', title: 'IMEI Verified', sub: 'Stolen phone check' },
  { icon: 'ti-rosette', title: 'Condition Graded', sub: '5-tier grading system' },
  { icon: 'ti-user-check', title: 'Seller Verified', sub: 'CNIC confirmed' },
  { icon: 'ti-lock', title: 'Safe Payments', sub: 'Escrow protected' },
]

export default function TrustBar() {
  return (
    <section className="trustbar">
      <div className="trustbar-inner">
        {TRUST_ITEMS.map(item => (
          <div key={item.title} className="trust-item">
            <div className="trust-icon-wrap">
              <i className={`ti ${item.icon}`} />
            </div>
            <div>
              <div className="trust-title">{item.title}</div>
              <div className="trust-sub">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}