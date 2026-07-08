import React from 'react';
import { Sparkles, Activity, ShieldAlert, BadgeInfo } from 'lucide-react';

export default function CustomizationGuide() {
  return (
    <div className="customization-guide-page container" style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', color: 'var(--text-main)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '800', color: 'var(--text-title)', marginBottom: '16px' }}>Jersey Customization Guide 🎨</h1>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Learn about our printing technologies, quality standards, and care instructions to keep your jersey pristine.
        </p>
      </div>

      {/* Main Pillars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '40px' }}>
        
        {/* Custom Printing Tech */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '36px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)', marginBottom: '16px' }}>
            <Sparkles size={24} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-title)', margin: '0' }}>Sublimation & Heat Transfer</h3>
          </div>
          <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-main)', marginBottom: '12px' }}>
            We utilize top-tier vinyl film heat transfer (flex printing) for numbers and player names. This matches the exact materials worn by professional players on the pitch:
          </p>
          <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8', color: 'var(--text-muted)' }}>
            <li><strong>Matte Finish</strong>: Resists glare under stadium floodlights.</li>
            <li><strong>Stretch Elasticity</strong>: The print moves dynamically with the jersey fabric without cracking or peeling.</li>
            <li><strong>Official Font Formats</strong>: We replicate the official fonts of Premier League, La Liga, and International squads.</li>
          </ul>
        </div>

        {/* Customization Options */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '36px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)', marginBottom: '16px' }}>
            <Activity size={24} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-title)', margin: '0' }}>How to Personalize</h3>
          </div>
          <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-main)', marginBottom: '12px' }}>
            When selecting customized items:
          </p>
          <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8', color: 'var(--text-muted)' }}>
            <li><strong>Name Length</strong>: Up to 12 uppercase characters (A-Z) can be printed in a straight or curved arch.</li>
            <li><strong>Number limits</strong>: Choose any number from 0 to 99. Double digits align perfectly centered.</li>
            <li><strong>Sleeve Badges</strong>: Upgrade your kit with official tournament badges (e.g. Champions League starball, Premier League lion badge).</li>
          </ul>
        </div>

        {/* Washing Care Instructions */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '36px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', marginBottom: '16px' }}>
            <ShieldAlert size={24} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-title)', margin: '0' }}>Washing & Care Instructions</h3>
          </div>
          <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-main)', marginBottom: '16px' }}>
            To protect the heat-pressed name, number, and badges, please follow these guidelines carefully:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '14px', color: 'var(--text-title)', display: 'block', marginBottom: '6px' }}>🧼 Wash Cold & Inside Out</strong>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Turn the jersey inside out before placing it in the machine. Wash in cold water (maximum 30°C) on a gentle cycle.
              </span>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '14px', color: 'var(--text-title)', display: 'block', marginBottom: '6px' }}>☀️ Air Dry Only</strong>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Do NOT machine tumble dry. Hang the jersey to dry naturally. High heat in dryers will melt the print adhesive.
              </span>
            </div>

            <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '14px', color: 'var(--text-title)', display: 'block', marginBottom: '6px' }}>💨 Iron Cautiously</strong>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Never place an iron directly on the prints. If ironing is needed, place a baking sheet or cotton towel over the print and iron on low.
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Alert strip */}
      <div style={{ display: 'flex', gap: '12px', background: 'var(--accent-light)', border: '1px solid var(--accent-border)', padding: '16px', borderRadius: '12px', alignItems: 'flex-start' }}>
        <BadgeInfo size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>
          <strong>Customization policy note:</strong> Since customized jerseys are crafted individually to order, we cannot accommodate order modifications or cancellation requests once customization printing begins (typically 4 hours after checkout).
        </span>
      </div>
    </div>
  );
}
