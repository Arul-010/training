import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="contact-page container" style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', color: 'var(--text-main)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '800', color: 'var(--text-title)', marginBottom: '16px' }}>Get In Touch ✉️</h1>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Have any custom request or need order assistance? Write to us and we'll reply within 12 hours.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start', marginBottom: '40px' }}>
        {/* Left Column: Form */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '36px', boxShadow: 'var(--shadow-md)', flex: 1.5 }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-title)', marginBottom: '24px' }}>Send a Message</h2>
          
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: '12px' }}>
              <span style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}>✉️</span>
              <strong style={{ display: 'block', fontSize: '16px', color: 'var(--text-title)', marginBottom: '6px' }}>Message Received!</strong>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0' }}>Thank you for reaching out. A support ticket has been opened.</p>
              <button 
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }); }}
                className="view-all-btn"
                style={{ marginTop: '20px' }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(15,23,42,0.02)', outline: 'none', color: 'var(--text-main)' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(15,23,42,0.02)', outline: 'none', color: 'var(--text-main)' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Message Details</label>
                <textarea
                  rows="4"
                  placeholder="Tell us what you need help with (e.g. customized jersey changes, sizing concerns)..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(15,23,42,0.02)', outline: 'none', color: 'var(--text-main)', resize: 'none' }}
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-action-btn"
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
              >
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Contact info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
          <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-title)', marginBottom: '20px' }}>Contact Channels</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '8px', borderRadius: '8px' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Email Support</span>
                  <a href="mailto:support@sportzone.com" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-title)', textDecoration: 'none' }}>support@sportzone.com</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '8px', borderRadius: '8px' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Call Helpline</span>
                  <a href="tel:+919876543210" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-title)', textDecoration: 'none' }}>+91 98765 43210</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '8px', borderRadius: '8px' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>HQ Warehouse</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-title)' }}>Sector 62, Noida, UP, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-title)', marginBottom: '8px' }}>🕒 Operational Hours</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Our support desk is online from <strong>Monday to Saturday, 9:00 AM – 7:00 PM IST</strong>. Print lines are active 24/7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
