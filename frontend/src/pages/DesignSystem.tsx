import { useState } from 'react'

export default function DesignSystem() {
  const [isDark, setIsDark] = useState(false)

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-foreground">ComplyMate Design System</h1>
        <button
          onClick={toggleDarkMode}
          className="btn-ghost rounded-full p-2"
        >
          {isDark ? '🌞' : '🌙'}
        </button>
      </header>

      {/* Colors */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Colors</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {['primary', 'secondary', 'accent'].map((color) => (
            <div key={color} className="space-y-2">
              <h3 className="text-sm font-medium text-foreground capitalize">{color}</h3>
              <div className="space-y-1">
                {[500, 600, 700].map((shade) => (
                  <div
                    key={shade}
                    className={`h-12 rounded-lg bg-${color}-${shade} flex items-center justify-center text-white font-medium`}
                  >
                    {shade}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Typography</h2>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Heading 1</h1>
          <h2 className="text-3xl font-semibold">Heading 2</h2>
          <h3 className="text-2xl font-medium">Heading 3</h3>
          <h4 className="text-xl font-medium">Heading 4</h4>
          <p className="text-base">Body text - The quick brown fox jumps over the lazy dog.</p>
          <p className="text-sm">Small text - The quick brown fox jumps over the lazy dog.</p>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn-primary">Primary Button</button>
          <button className="btn-secondary">Secondary Button</button>
          <button className="btn-accent">Accent Button</button>
          <button className="btn-ghost">Ghost Button</button>
          <button className="btn-destructive">Destructive Button</button>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Cards</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <h3 className="mb-2 text-lg font-semibold">Basic Card</h3>
            <p className="text-muted-foreground">This is a basic card with some content.</p>
          </div>
          <div className="card card-hover">
            <h3 className="mb-2 text-lg font-semibold">Hover Card</h3>
            <p className="text-muted-foreground">This card has a hover effect.</p>
          </div>
        </div>
      </section>

      {/* Form Elements */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Form Elements</h2>
        <div className="max-w-md space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Input</label>
            <input type="text" className="input" placeholder="Enter text..." />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Input with Error</label>
            <input type="text" className="input input-error" placeholder="Error state" />
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Badges</h2>
        <div className="flex gap-4">
          <span className="badge-primary">Primary</span>
          <span className="badge-secondary">Secondary</span>
          <span className="badge-accent">Accent</span>
        </div>
      </section>

      {/* Loading States */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Loading States</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-24 skeleton"></div>
          <div className="h-24 skeleton"></div>
          <div className="h-24 skeleton"></div>
        </div>
      </section>

      {/* Toast Notifications */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Toast Notifications</h2>
        <div className="space-y-4">
          <div className="toast toast-success">Success message</div>
          <div className="toast toast-error">Error message</div>
          <div className="toast toast-warning">Warning message</div>
        </div>
      </section>
    </div>
  )
} 