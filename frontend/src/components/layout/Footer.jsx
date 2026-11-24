import { Link } from 'react-router-dom'
import { ExternalLink, Compass } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">
                Cynbit Smart Discovery
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Intelligent Project Discovery &amp; Lead Qualification System — an independent
              full-stack prototype demonstrating structured client onboarding and deterministic
              solution recommendations.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/discover" className="hover:text-white transition-colors">
                  Start Project Discovery
                </Link>
              </li>
              <li>
                <Link to="/demo/admin" className="hover:text-white transition-colors">
                  Demo Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Reference &amp; Disclaimer
            </h3>
            <a
              href="https://www.cynbit.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 mb-3"
            >
              Cynbit Technologies Official Website
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-xs text-slate-400 leading-relaxed">
              Independent technical assessment prototype. Not affiliated with, endorsed by, or
              connected to Cynbit Technologies&apos; production systems. Public evaluators should use
              fictional contact details.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>Cynbit Smart Discovery — Full Stack Developer Intern Technical Assessment Prototype</p>
          <p>Built with React, FastAPI &amp; PostgreSQL</p>
        </div>
      </div>
    </footer>
  )
}
