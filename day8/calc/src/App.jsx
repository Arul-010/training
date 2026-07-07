import { useState, useEffect } from 'react'
import './App.css'
import funnyGuy from '/funny_guy.png'

function App() {
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState('')
  const [punchEffect, setPunchEffect] = useState(false)

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
    }
  }

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const toggleSign = () => {
    if (display !== '0') {
      setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display)
    }
  }

  const inputPercent = () => {
    const value = parseFloat(display)
    if (value !== 0) {
      setDisplay(String(value / 100))
    }
  }

  const clearAll = () => {
    setDisplay('0')
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(false)
    setHistory('')
  }

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display)

    if (prevValue == null) {
      setPrevValue(inputValue)
      setHistory(`${inputValue} ${nextOperator}`)
    } else if (operator) {
      const currentValue = prevValue
      let result

      switch (operator) {
        case '+': result = currentValue + inputValue; break
        case '−': result = currentValue - inputValue; break
        case '×': result = currentValue * inputValue; break
        case '÷':
          result = inputValue !== 0 ? currentValue / inputValue : 'Error'
          break
        default: result = inputValue
      }

      if (result === 'Error') {
        setDisplay('Error')
        setPrevValue(null)
        setOperator(null)
        setHistory('')
        setWaitingForOperand(false)
        return
      }

      const cleanResult = parseFloat(result.toFixed(10))
      setPrevValue(cleanResult)
      setDisplay(String(cleanResult))
      setHistory(`${cleanResult} ${nextOperator}`)
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
  }

  const [attack, setAttack] = useState(false);

  const handleEquals = () => {
    const inputValue = parseFloat(display)

    if (operator && prevValue != null) {
      const currentValue = prevValue
      let result

      switch (operator) {
        case '+': result = currentValue + inputValue; break
        case '−': result = currentValue - inputValue; break
        case '×': result = currentValue * inputValue; break
        case '÷':
          result = inputValue !== 0 ? currentValue / inputValue : 'Error'
          break
        default: result = inputValue
      }

      if (result === 'Error') {
        setDisplay('Error')
      } else {
        const cleanResult = parseFloat(result.toFixed(10))
        setDisplay(String(cleanResult))
        setHistory(`${currentValue} ${operator} ${inputValue} =`)
        // Trigger attack animation when calculation succeeds
        setAttack(true)
        // Reset attack after animation duration (e.g., 800ms)
        setTimeout(() => setAttack(false), 800)
      }

      setPrevValue(null)
      setOperator(null)
      setWaitingForOperand(false)
    }
  }

  // Trigger manga punch effect on button press
  const triggerPunch = () => {
    setPunchEffect(true)
    setTimeout(() => setPunchEffect(false), 400)
  }

  const handleButtonClick = (action) => {
    triggerPunch()
    // Start attack animation for Luffy and Zoro
    setAttack(true)
    setTimeout(() => setAttack(false), 800)
    action()
  }

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { key } = e
      if (e.repeat) return

      // Digits 0-9
      if (/[0-9]/.test(key)) {
        handleButtonClick(() => inputDigit(Number(key)))
      }
      // Operators
      else if (key === '+') {
        handleButtonClick(() => performOperation('+'))
      } else if (key === '-') {
        handleButtonClick(() => performOperation('−'))
      } else if (key === '*' || key.toLowerCase() === 'x') {
        handleButtonClick(() => performOperation('×'))
      } else if (key === '/') {
        handleButtonClick(() => performOperation('÷'))
      }
      // Equals
      else if (key === 'Enter' || key === '=') {
        handleButtonClick(handleEquals)
      }
      // Dot
      else if (key === '.') {
        handleButtonClick(inputDot)
      }
      // Clear
      else if (key === 'Escape' || key === 'Backspace' || key.toLowerCase() === 'c') {
        handleButtonClick(clearAll)
      }
      // Percent
      else if (key === '%') {
        handleButtonClick(inputPercent)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [display, operator, prevValue, waitingForOperand])

  // Format display for large numbers
  const formatDisplay = (value) => {
    if (value === 'Error') return value
    if (value.length > 12) {
      const num = parseFloat(value)
      if (Math.abs(num) >= 1e12 || (Math.abs(num) < 0.0001 && num !== 0)) {
        return num.toExponential(6)
      }
      return value.slice(0, 12)
    }
    return value
  }

  const buttons = [
    { label: 'AC', type: 'function', action: clearAll },
    { label: '+/−', type: 'function', action: toggleSign },
    { label: '%', type: 'function', action: inputPercent },
    { label: '÷', type: 'operator', action: () => performOperation('÷'), active: operator === '÷' && waitingForOperand },

    { label: '7', type: 'digit', action: () => inputDigit(7) },
    { label: '8', type: 'digit', action: () => inputDigit(8) },
    { label: '9', type: 'digit', action: () => inputDigit(9) },
    { label: '×', type: 'operator', action: () => performOperation('×'), active: operator === '×' && waitingForOperand },

    { label: '4', type: 'digit', action: () => inputDigit(4) },
    { label: '5', type: 'digit', action: () => inputDigit(5) },
    { label: '6', type: 'digit', action: () => inputDigit(6) },
    { label: '−', type: 'operator', action: () => performOperation('−'), active: operator === '−' && waitingForOperand },

    { label: '1', type: 'digit', action: () => inputDigit(1) },
    { label: '2', type: 'digit', action: () => inputDigit(2) },
    { label: '3', type: 'digit', action: () => inputDigit(3) },
    { label: '+', type: 'operator', action: () => performOperation('+'), active: operator === '+' && waitingForOperand },

    { label: '0', type: 'digit zero', action: () => inputDigit(0) },
    { label: '.', type: 'digit', action: inputDot },
    { label: '=', type: 'equals', action: handleEquals },
  ]

  useEffect(() => {
    if (display === '9') {
      document.body.classList.add('has-nine')
    } else {
      document.body.classList.remove('has-nine')
    }
  }, [display])

  return (
    <>
      {/* Funny Guy Side Images - shown when result === 9 */}
      {display === '9' && (
        <div className="funny-guys-wrapper">
          {/* Screen shake overlay */}
          <div className="screen-shake-overlay" />

          {/* LEFT character zone */}
          <div className="funny-guy-zone funny-guy-zone-left">
            {/* Comic burst behind */}
            <div className="comic-burst comic-burst-left" aria-hidden="true">
              <svg viewBox="0 0 200 200" width="300" height="300">
                <polygon points="100,10 120,75 190,75 135,110 155,175 100,140 45,175 65,110 10,75 80,75" fill="var(--cartoon-yellow-accent)" stroke="var(--cartoon-black)" strokeWidth="4" strokeLinejoin="round" />
              </svg>
            </div>
            {/* Sparkle particles */}
            <span className="sparkle sparkle-1" aria-hidden="true">✨</span>
            <span className="sparkle sparkle-2" aria-hidden="true">⭐</span>
            <span className="sparkle sparkle-3" aria-hidden="true">💥</span>
            <span className="sparkle sparkle-4" aria-hidden="true">🌟</span>
            <span className="sparkle sparkle-5" aria-hidden="true">✨</span>
            {/* Speech bubble */}
            <div className="speech-bubble speech-bubble-left" aria-hidden="true">
              <span className="speech-text">maran🤡</span>
            </div>
            <img src={funnyGuy} alt="Funny Guy Left" className="funny-guy funny-guy-left" />
          </div>

          {/* RIGHT character zone */}
          <div className="funny-guy-zone funny-guy-zone-right">
            {/* Comic burst behind */}
            <div className="comic-burst comic-burst-right" aria-hidden="true">
              <svg viewBox="0 0 200 200" width="300" height="300">
                <polygon points="100,10 120,75 190,75 135,110 155,175 100,140 45,175 65,110 10,75 80,75" fill="var(--cartoon-orange)" stroke="var(--cartoon-black)" strokeWidth="4" strokeLinejoin="round" />
              </svg>
            </div>
            {/* Sparkle particles */}
            <span className="sparkle sparkle-r1" aria-hidden="true">⭐</span>
            <span className="sparkle sparkle-r2" aria-hidden="true">✨</span>
            <span className="sparkle sparkle-r3" aria-hidden="true">💫</span>
            <span className="sparkle sparkle-r4" aria-hidden="true">🌟</span>
            <span className="sparkle sparkle-r5" aria-hidden="true">💥</span>
            {/* Speech bubble */}
            <div className="speech-bubble speech-bubble-right" aria-hidden="true">
              <span className="speech-text">parota kadai🤤</span>
            </div>
            <img src={funnyGuy} alt="Funny Guy Right" className="funny-guy funny-guy-right" />
          </div>

        </div>
      )}

      {/* Top Right Spinning Head (replaces Sun when result is 9) */}
      {display === '9' && (
        <div className="funny-guy-head-spin spinning-head-right">
          <img src={funnyGuy} alt="Funny Guy Head Right" />
        </div>
      )}

      {/* Cartoon rocket */}
      {display !== '9' && (
        <img className="cartoon-rocket" src="/cartoon-rocket.png" alt="Cartoon Rocket" />
      )}

      {/* Cartoon mascots / Spinning Head Left (replaces Star when result is 9) */}
      {display === '9' ? (
        <div className="funny-guy-head-spin spinning-head-left">
          <img src={funnyGuy} alt="Funny Guy Head Left" />
        </div>
      ) : (
        <img className={`cartoon-mascot star ${attack ? 'attack' : ''}`} src="/cartoon-star.png" alt="Cartoon Star" />
      )}
      <div className={`cartoon-mascot cloud ${attack ? 'attack' : ''}`} aria-hidden="true">
        <svg viewBox="0 0 100 60" width="100" height="60">
          <path d="M 20,40 
                   A 15,15 0 0,1 22,18 
                   A 22,22 0 0,1 60,15 
                   A 18,18 0 0,1 82,25 
                   A 15,15 0 0,1 80,45 
                   Z"
            fill="#ffffff"
            stroke="#2f3542"
            strokeWidth="4"
            strokeLinejoin="round" />
          {/* Eyes */}
          <circle cx="42" cy="30" r="3.5" fill="#2f3542" />
          <circle cx="58" cy="30" r="3.5" fill="#2f3542" />
          {/* Smile */}
          <path d="M 46,36 Q 50,40 54,36" fill="none" stroke="#2f3542" strokeWidth="2.5" strokeLinecap="round" />
          {/* Cheeks */}
          <circle cx="37" cy="33" r="2.5" fill="#ff6b81" />
          <circle cx="63" cy="33" r="2.5" fill="#ff6b81" />
        </svg>
      </div>

      <div className="calc-wrapper">
        {/* Cartoon speed lines background effect */}
        <div className={`speed-lines ${punchEffect ? 'active' : ''}`} aria-hidden="true"></div>

        {/* Floating cartoon elements */}
        <div className="floating-elements" aria-hidden="true">
          {/* Star Sticker */}
          <svg className="float-item float-star" viewBox="0 0 100 100" width="60" height="60">
            <polygon points="50,9 64,38 96,43 73,65 78,97 50,82 22,97 27,65 4,43 36,38" fill="#ffd32a" stroke="#2f3542" strokeWidth="6" strokeLinejoin="round" />
            <path d="M 38,38 L 48,22" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
          </svg>

          {/* Cloud Sticker */}
          <svg className="float-item float-cloud" viewBox="0 0 100 100" width="70" height="70">
            <path d="M 25,65 A 15,15 0 0,1 27,38 A 20,20 0 0,1 62,35 A 16,16 0 0,1 82,45 A 15,15 0 0,1 80,70 Z" fill="#ffffff" stroke="#2f3542" strokeWidth="6" strokeLinejoin="round" />
            <path d="M 38,45 A 10,10 0 0,1 55,42" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
          </svg>

          {/* Lightning Sticker */}
          <svg className="float-item float-lightning" viewBox="0 0 100 100" width="60" height="60">
            <polygon points="50,10 80,45 55,45 70,90 20,45 45,45" fill="#ffa502" stroke="#2f3542" strokeWidth="6" strokeLinejoin="round" />
            <path d="M 40,25 L 50,40" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
          </svg>

          {/* Balloon Sticker */}
          <svg className="float-item float-balloon" viewBox="0 0 100 100" width="65" height="65">
            <path d="M 50,75 Q 45,85 50,95" fill="none" stroke="#2f3542" strokeWidth="4" />
            <ellipse cx="50" cy="45" rx="25" ry="30" fill="#ff4757" stroke="#2f3542" strokeWidth="6" />
            <polygon points="50,71 45,77 55,77" fill="#ff4757" stroke="#2f3542" strokeWidth="4" />
            <ellipse cx="42" cy="35" rx="6" ry="10" fill="#ffffff" opacity="0.3" transform="rotate(-15 42 35)" />
          </svg>

          {/* Sparkle Sticker */}
          <svg className="float-item float-sparkle" viewBox="0 0 100 100" width="60" height="60">
            <path d="M 50,10 Q 50,50 90,50 Q 50,50 50,90 Q 50,50 10,50 Q 50,50 50,10 Z" fill="#2ed573" stroke="#2f3542" strokeWidth="6" strokeLinejoin="round" />
            <path d="M 42,42 L 32,32" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>

        <div className="calculator" role="application" aria-label="Cartoon Calculator">
          {/* Cartoon Title Header */}
          <div className="cartoon-header">
            <span className="header-star">👾🤖✨</span>
            <span className="header-title">CARTOON CALC</span>
            <span className="header-star">✨🎨🍭</span>
          </div>

          {/* Ribbon subtitle */}
          <div className="comic-banner">
            <span>🎈 ~ Fun Edition ~ 🎉</span>
          </div>

          {/* Display panel styled like a bubbly cartoon window */}
          <div className="display-panel">
            <div className="panel-sparkle" aria-hidden="true">✨🌈</div>
            <div className="display-history" aria-live="polite">{history || '\u00A0'}</div>
            <div
              className="display-value"
              aria-live="assertive"
              style={{ fontSize: display.length > 9 ? '2rem' : display.length > 6 ? '2.6rem' : '3.2rem' }}
            >
              {formatDisplay(display)}
            </div>
            <div className="panel-cloud" aria-hidden="true">💡☁️</div>
          </div>

          {/* Button grid */}
          <div className="button-grid">
            {buttons.map((btn) => (
              <button
                key={btn.label}
                id={`btn-${btn.label.replace(/[^a-zA-Z0-9]/g, '_')}`}
                className={`calc-btn ${btn.type} ${btn.active ? 'active' : ''}`}
                onClick={() => handleButtonClick(btn.action)}
                aria-label={btn.label}
              >
                <span className="btn-label">
                  {btn.label === 'AC' ? '🧹AC' :
                    btn.label === '+/−' ? '🔄 ±' :
                      btn.label === '%' ? '% 📊' :
                        btn.label === '÷' ? '➗' :
                          btn.label === '×' ? '✖️' :
                            btn.label === '−' ? '➖' :
                              btn.label === '+' ? '➕' :
                                btn.label === '=' ? '🎯 =' :
                                  btn.label}
                </span>
              </button>
            ))}
          </div>

          {/* Footer quote */}
          <div className="cartoon-footer">
            <p className="quote">⚡ Keep on calculating! 🚀🎉🎨</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
