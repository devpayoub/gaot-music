'use client'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/account' },
]

export default function NavbarAccount() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20">
      {/* Mobile Navbar */}
      <nav className="px-10 lg:hidden">
        <div className="flex h-14 items-center justify-between gap-6">
          <Link href="/" aria-label="home" className="flex items-center space-x-2 dark:invert">
            <Image src="/logo2.png" alt="logo" width={40} height={40} />
          </Link>
          <ul className="flex items-center gap-6">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-zinc-800/50">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="text-red-600">
                  <button onClick={() => {/* Add your logout logic */}} className="flex items-center">
                    Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Desktop Navbar */}
      <nav className="hidden lg:block px-10">
        <div className="flex h-14 items-center justify-around">
          <Link href="/" aria-label="home" className="flex items-center space-x-2 dark:invert">
            <Image src="/logo2.png" alt="logo" width={40} height={40} />
          </Link>

          <div className="flex-1 flex justify-center px-32">
            <ul className="flex items-center gap-8">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-accent-foreground block duration-150"
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center lg:border-l lg:pl-6 ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-zinc-800/50">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="text-red-600">
                  <button onClick={() => {/* Add your logout logic */}} className="flex items-center">
                    Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  )
}