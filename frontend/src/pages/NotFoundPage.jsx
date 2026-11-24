import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import { FileQuestion } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
          <p className="text-lg font-semibold text-slate-700 mb-2">Page Not Found</p>
          <p className="text-sm text-slate-500 mb-6">
            The page you requested does not exist or has been moved.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
            <Link to="/discover">
              <Button variant="outline">Start Discovery</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
