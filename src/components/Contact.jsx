export default function Contact() {
  const endpoints = [
    { method: "GET", path: "linkedin.com/in/qvd-dang", href: "https://www.linkedin.com/in/qvd-dang/" },
    { method: "GET", path: "github.com/qvd808", href: "https://github.com/qvd808" },
    { method: "POST", path: "mailto:dqvinh101@gmail.com", href: "mailto:dqvinh101@gmail.com" },
    { method: "GET", path: "resume.pdf", href: "https://drive.google.com/file/d/1IM4YwjO-NO8uF1Qor7D95fOap3vGtt5V/view?usp=drive_link" },
  ];

  return (
    <section className="section" id="contact">
      <div className="section-label">§ contact</div>

      <div className="contact-wrap">
        <div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--fg-4)', marginBottom: 18 }}>
            <span style={{ color: 'var(--accent)' }}>●</span> INBOX OPEN
          </div>
          <h2 className="contact-title">
            Want to talk about <em className="serif">FPGAs, Zig, or why nvim is superior?</em>
          </h2>
          <p className="contact-sub">
            Or, you know, about hiring me. I'm fresh-grad and genuinely open to whatever sounds interesting. I reply within a day, usually faster.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="mailto:dqvinh101@gmail.com" className="btn primary">
              dqvinh101@gmail.com <span className="arrow">→</span>
            </a>
            <a href="https://www.linkedin.com/in/qvd-dang/" target="_blank" className="btn">linkedin</a>
          </div>
        </div>

        <div>
          <div className="rowline">ENDPOINTS</div>
          <div className="endpoint-list">
            {endpoints.map(e => (
              <a key={e.path} href={e.href} target="_blank" rel="noreferrer" className="endpoint">
                <div className="endpoint-left">
                  <span className="endpoint-method">{e.method}</span>
                  <span className="endpoint-path">{e.path}</span>
                </div>
                <span className="endpoint-arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}