import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../components/Logo';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="text-gray-600">Your personal digital journal, reimagined.</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link></li>
              <li><Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
              <li><Link href="/team" className="text-gray-600 hover:text-gray-900">Team</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Mejo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};