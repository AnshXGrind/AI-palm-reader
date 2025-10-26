import Link from 'next/link'

export default function Custom404() {
  return (
    <div className="error-page">
      <h1 className="error-icon">🔮</h1>
      <h2 className="error-title">Page Not Found</h2>
      <p className="error-message">
        The mystical forces couldn't locate this page
      </p>
      <Link href="/" className="error-button">
        Return to Palm Reading
      </Link>
    </div>
  )
}