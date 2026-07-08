import React from 'react';
import { Truck, RotateCcw, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="support-page container" style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', color: 'var(--text-main)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '800', color: 'var(--text-title)', marginBottom: '16px' }}>Help & Support Center 💬</h1>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Got questions about shipping, sizes, or our returns policy? You've come to the right place.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        {/* Shipping Card */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)', marginBottom: '16px' }}>
            <Truck size={24} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-title)', margin: '0' }}>Shipping & Delivery</h3>
          </div>
          <ul style={{ paddingLeft: '20px', margin: '0', fontSize: '14px', lineHeight: '1.8', color: 'var(--text-muted)' }}>
            <li><strong>Free Delivery</strong> on all orders above ₹999.</li>
            <li>Standard dispatch within 24-48 hours.</li>
            <li>Customized items take an extra 24 hours to print and dry.</li>
            <li>Transit time: 2-4 business days for major cities, 5-7 days otherwise.</li>
          </ul>
        </div>

        {/* Returns Card */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)', marginBottom: '16px' }}>
            <RotateCcw size={24} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-title)', margin: '0' }}>Returns & Replacements</h3>
          </div>
          <ul style={{ paddingLeft: '20px', margin: '0', fontSize: '14px', lineHeight: '1.8', color: 'var(--text-muted)' }}>
            <li><strong>10-Day Policy</strong>: Hassle-free replacement for sizing problems.</li>
            <li>Customized jerseys are not eligible for returns unless there is a physical printing mistake or stitching defect.</li>
            <li>In case of defect, we send a free replacement without asking you to return the original gear.</li>
          </ul>
        </div>
      </div>

      {/* Sizing Chart Section */}
      <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '40px', marginBottom: '40px', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-title)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <HelpCircle size={22} style={{ color: 'var(--accent)' }} />
          <span>Jersey Size Guide</span>
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
          All measurements are in inches. Standard athletic fit. We recommend choosing one size larger if you prefer a loose, relaxed fit.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-title)' }}>
                <th style={{ padding: '12px 8px', fontWeight: '700' }}>Size</th>
                <th style={{ padding: '12px 8px', fontWeight: '700' }}>Chest (in)</th>
                <th style={{ padding: '12px 8px', fontWeight: '700' }}>Length (in)</th>
                <th style={{ padding: '12px 8px', fontWeight: '700' }}>Sleeve (in)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>S</td>
                <td style={{ padding: '12px 8px' }}>38"</td>
                <td style={{ padding: '12px 8px' }}>27"</td>
                <td style={{ padding: '12px 8px' }}>8.0"</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>M</td>
                <td style={{ padding: '12px 8px' }}>40"</td>
                <td style={{ padding: '12px 8px' }}>28"</td>
                <td style={{ padding: '12px 8px' }}>8.5"</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>L</td>
                <td style={{ padding: '12px 8px' }}>42"</td>
                <td style={{ padding: '12px 8px' }}>29"</td>
                <td style={{ padding: '12px 8px' }}>9.0"</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>XL</td>
                <td style={{ padding: '12px 8px' }}>44"</td>
                <td style={{ padding: '12px 8px' }}>30"</td>
                <td style={{ padding: '12px 8px' }}>9.5"</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>XXL</td>
                <td style={{ padding: '12px 8px' }}>46"</td>
                <td style={{ padding: '12px 8px' }}>31"</td>
                <td style={{ padding: '12px 8px' }}>10.0"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
