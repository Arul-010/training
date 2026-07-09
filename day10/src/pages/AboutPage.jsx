import React from 'react';
import { ShieldCheck, Compass, Sparkles, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="about-page container" style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', color: 'var(--text-main)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '800', color: 'var(--text-title)', marginBottom: '16px' }}>Our Story 🏆</h1>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Bringing the stadium atmosphere directly to your doorstep. We are the ultimate hub for premium custom sports apparel.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '40px', marginBottom: '40px', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-title)', marginBottom: '20px' }}>Who We Are</h2>
        <p style={{ lineHeight: '1.8', marginBottom: '24px', fontSize: '15px' }}>
          Founded in 2024, <strong>SportZone</strong> emerged from a simple desire: to provide fans across India with access to high-quality, customized sports jerseys, footwear, and accessories without the premium markup. Whether you're playing a weekend match on the turf, backing your team from the stands, or exercising, we design gear that performs.
        </p>

        <p style={{ lineHeight: '1.8', marginBottom: '24px', fontSize: '15px' }}>
          We specialize in high-definition heat-transfer printing and premium jersey customizations. By combining state-of-the-art materials with fan-first custom options, we enable sports enthusiasts to engrave their identity directly onto their favorite team's colors.
        </p>

        {/* Brand Core Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginTop: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)' }}>
              <ShieldCheck size={20} />
              <strong style={{ fontSize: '16px', color: 'var(--text-title)' }}>Premium Quality</strong>
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              We use double-knit breathable polyester meshes, professional embroidery, and durable print vinyls.
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)' }}>
              <Sparkles size={20} />
              <strong style={{ fontSize: '16px', color: 'var(--text-title)' }}>Free Customization</strong>
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Add your name, number, and badges for free. Every jersey is personalized by hand.
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)' }}>
              <Compass size={20} />
              <strong style={{ fontSize: '16px', color: 'var(--text-title)' }}>Sustainable Production</strong>
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              We optimize fabric cutting and use eco-safe inks to minimize dye waste.
            </span>
          </div>
        </div>
      </div>

      {/* Quote Banner */}
      <div style={{ textAlign: 'center', background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: '16px', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <Heart size={28} style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-title)', fontStyle: 'italic' }}>
          "Built by athletes, designed for fans, made to last."
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          — The SportZone Team
        </span>
      </div>
    </div>
  );
}
