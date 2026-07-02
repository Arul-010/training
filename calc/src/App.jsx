import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [particles, setParticles] = useState([])
  const [animationClass, setAnimationClass] = useState('')
  const [lastKeyPressed, setLastKeyPressed] = useState(null)
  const [bgGradientIndex, setBgGradientIndex] = useState(0)

  // Gradient themes that change on keypress or reset
  const bgGradients = [
    'linear-gradient(135deg, #111 0%, #1a1a2e 100%)',
    'linear-gradient(135deg, #1a0f30 0%, #0d0614 100%)',
    'linear-gradient(135deg, #0b1a1e 0%, #050d0f 100%)',
    'linear-gradient(135deg, #200f1a 0%, #0d060b 100%)',
    'linear-gradient(135deg, #12200f 0%, #080f07 100%)'
  ]

  const handleIncrement = () => {
    setCount((prev) => prev + 1)
    setAnimationClass('pop-increment')
  }

  const handleDecrement = () => {
    setCount((prev) => prev - 1)
    setAnimationClass('pop-decrement')
  }

  const handleReset = () => {
    setCount(0)
    setAnimationClass('spin-reset')
  }

  // Clear animation class after transition
  useEffect(() => {
    if (!animationClass) return
    const timeout = setTimeout(() => {
      setAnimationClass('')
    }, 400)
    return () => clearTimeout(timeout)
  }, [animationClass])

  // Keydown handler for keyboard triggers and background animation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key
      let keyText = key

      // Ignore keys like Alt, Command, Control for functionality, but spawn particles for them
      if (e.repeat) return

      // Handle custom shortcut triggers for counter
      if (key === '+' || key === '=') {
        handleIncrement()
        keyText = '+'
      } else if (key === '-' || key === '_') {
        handleDecrement()
        keyText = '-'
      } else if (key.toLowerCase() === 'r') {
        handleReset()
        keyText = 'RESET'
      }

      // Format clean string for display
      if (keyText === ' ') keyText = 'SPACE'
      else if (keyText === 'ArrowUp') keyText = '↑'
      else if (keyText === 'ArrowDown') keyText = '↓'
      else if (keyText === 'ArrowLeft') keyText = '←'
      else if (keyText === 'ArrowRight') keyText = '→'
      else if (keyText === 'Enter') keyText = 'ENTER'
      else if (keyText === 'Shift') keyText = 'SHIFT'
      else if (keyText === 'Control') keyText = 'CTRL'
      else if (keyText === 'Alt') keyText = 'ALT'
      else if (keyText === 'Backspace') keyText = 'BACK'
      else if (keyText === 'Delete') keyText = 'DEL'
      else if (keyText === 'Escape') keyText = 'ESC'
      else if (keyText.length === 1) {
        keyText = keyText.toUpperCase()
      }

      // Create a funky particle
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const colors = ['pink', 'cyan', 'yellow', 'green', 'purple', 'orange']
      const randomColor = colors[Math.floor(Math.random() * colors.length)]

      // Select random coordinates on screen
      const x = Math.random() * 80 + 10 // 10% to 90%
      const y = Math.random() * 80 + 10 // 10% to 90%

      const rotation = Math.random() * 90 - 45 // -45 to 45 degrees
      const scale = Math.random() * 1.8 + 0.8  // 0.8 to 2.6 size

      const newParticle = {
        id,
        text: keyText,
        x,
        y,
        color: randomColor,
        rotation,
        scale,
      }

      setParticles((prev) => [...prev, newParticle].slice(-30)) // Max 30 particles at a time
      setLastKeyPressed(keyText)

      // Rotate background gradient theme
      setBgGradientIndex((prev) => (prev + 1) % bgGradients.length)

      // Auto cleanup particle
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id))
      }, 1200)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [bgGradients.length])

  return (
    <div
      className="funky-container"
      style={{ background: bgGradients[bgGradientIndex] }}
    >
      {/* Background grid pattern overlay */}
      <div className="grid-overlay"></div>

      {/* Floating retro shapes in background */}
      <div className="floating-shapes">
        <div className="shape shape-circle"></div>
        <div className="shape shape-triangle"></div>
        <div className="shape shape-square"></div>
        <div className="shape shape-cross"></div>
      </div>

      {/* Dynamic Keypress Particles */}
      <div className="particles-holder">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`key-particle color-${p.color}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg) scale(${p.scale})`,
            }}
          >
            {p.text}
          </div>
        ))}
      </div>

      {/* Header Sticker */}
      <header className="funky-header">
        <h1 className="header-title">⚡ FUNNY COUNTER⚡</h1>
        <p className="header-subtitle">Click Buttons or Press Keys to Unleash Chaos!</p>
      </header>

      {/* Main Neo-Brutalist Card */}
      <main className="brutalist-card">
        <div className="card-header">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
          <span className="window-title">COUNTER_OS.EXE</span>
        </div>

        <div className="card-body">
          <div className="counter-container">
            <div className={`counter-number ${animationClass}`}>
              {count}
            </div>
            <div className="counter-shadow-text">{count}</div>
          </div>

          <div className="button-group">
            <button
              id="decrease-btn"
              className="btn btn-decrement"
              onClick={handleDecrement}
              aria-label="Decrease counter"
            >
              <span className="btn-icon">➖</span>
              <span className="btn-text">DECREASE</span>
            </button>

            <button
              id="reset-btn"
              className="btn btn-reset"
              onClick={handleReset}
              aria-label="Reset counter"
            >
              <span className="btn-icon">↺</span>
              <span className="btn-text">RESET</span>
            </button>

            <button
              id="increase-btn"
              className="btn btn-increment"
              onClick={handleIncrement}
              aria-label="Increase counter"
            >
              <span className="btn-icon">➕</span>
              <span className="btn-text">INCREASE</span>
            </button>
          </div>
        </div>
      </main>

      {/* Keypress HUD Indicator */}
      <footer className="funky-footer">
        <div className="hud-panel">
          <div className="hud-row">
            <span className="hud-label">LAST PRESSED:</span>
            <span className="hud-value">{lastKeyPressed || 'NONE'}</span>
          </div>
          <div className="hud-row shortcuts">
            <span className="badge badge-pink">[+] Increment</span>
            <span className="badge badge-cyan">[-] Decrement</span>
            <span className="badge badge-yellow">[R] Reset</span>
            <span className="badge badge-green">[Any Key] Funky Chaos</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
