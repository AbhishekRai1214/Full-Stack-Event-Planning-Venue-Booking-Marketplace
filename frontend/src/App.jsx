import { Routes, Route } from 'react-router-dom';

/**
 * Root Application Component
 *
 * This component will grow as pages are implemented in later phases.
 * Currently shows a phase-tracking placeholder page with correct Tailwind styling.
 *
 * Phase 2: UI Foundation (Navbar, Footer, design system)
 * Phase 3: Home Page implementation
 * Phase 4+: All other pages
 */
function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Phase placeholder – will be replaced with full HomePage in Phase 3 */}
        <Route path="/" element={<PlaceholderHome />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function PlaceholderHome() {
  const phases = [
    { num: 0, label: 'Architecture Planning', done: true },
    { num: 1, label: 'Project Setup (MERN)', done: true },
    { num: 2, label: 'UI Design System', done: false },
    { num: 3, label: 'Home Page', done: false },
    { num: 4, label: 'Venue Marketplace', done: false },
    { num: 5, label: 'Vendor Marketplace', done: false },
    { num: 6, label: 'Authentication & Auth', done: false },
  ];

  return (
    <div className="min-h-screen bg-background-secondary flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 bg-primary rounded-card flex items-center justify-center shadow-primary-sm">
            <span className="text-white font-serif font-bold text-2xl">V</span>
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-text">VenueAura</h1>
            <p className="text-text-muted text-xs">Event Planning Marketplace</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="text-center mb-10">
          <h2 className="text-display-md font-serif font-bold text-text mb-3 text-balance">
            Plan Every Celebration{' '}
            <span className="text-primary">Beautifully</span>
          </h2>
          <p className="text-text-muted text-lg">
            MERN stack setup complete. Building the full UI in the upcoming phases.
          </p>
        </div>

        {/* Phase tracker card */}
        <div className="card p-6 mb-6">
          <h3 className="font-sans font-semibold text-text mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
            </span>
            Development Progress
          </h3>
          <div className="space-y-3">
            {phases.map((phase) => (
              <div key={phase.num} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    phase.done
                      ? 'bg-primary text-white'
                      : 'bg-background-secondary text-text-muted border border-border'
                  }`}
                >
                  {phase.done ? '✓' : phase.num}
                </div>
                <span
                  className={`text-sm ${
                    phase.done ? 'text-text font-medium' : 'text-text-muted'
                  }`}
                >
                  Phase {phase.num}: {phase.label}
                </span>
                {phase.done && (
                  <span className="badge-primary ml-auto text-xs">Complete</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack card */}
        <div className="card p-6">
          <h3 className="font-sans font-semibold text-text mb-4">Tech Stack</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Frontend', value: 'React 18 + Vite 5' },
              { label: 'Styling', value: 'Tailwind CSS v3' },
              { label: 'State', value: 'Redux Toolkit' },
              { label: 'Backend', value: 'Node.js + Express' },
              { label: 'Database', value: 'MongoDB + Mongoose' },
              { label: 'Auth', value: 'JWT + bcrypt' },
            ].map((item) => (
              <div key={item.label} className="bg-background-secondary rounded-button p-3">
                <p className="text-xs text-text-muted">{item.label}</p>
                <p className="text-sm font-medium text-text mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-text-muted text-sm mt-6">
          Backend API: <a href="http://localhost:5000/health" className="text-primary hover:underline">localhost:5000/health</a>
        </p>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h2 className="text-8xl font-serif font-bold text-primary mb-4">404</h2>
        <h3 className="text-2xl font-serif font-semibold text-text mb-3">Page Not Found</h3>
        <p className="text-text-muted mb-8">
          The page you're looking for doesn't exist yet.
        </p>
        <a href="/" className="btn-primary">
          Go Home
        </a>
      </div>
    </div>
  );
}

export default App;

