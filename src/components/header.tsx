import { Triangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Triangle className="h-6 w-6 text-white fill-white" />
            <span className="text-xl font-bold text-white">Vercel</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-gray-300 hover:text-white transition-colors">
              Products
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors">
              Solutions
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors">
              Resources
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors">
              Enterprise
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Sign In
            </Button>
            <Button className="bg-white text-black hover:bg-gray-200">Start Deploying</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
