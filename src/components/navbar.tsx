'use client'
import Link from 'next/link'
import { Menu, X, User, Settings, LogOut, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/contexts/AuthContext'

const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Artists', href: '/artists' },
    { name: 'Albums', href: '/albums' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
]

export const Navbar = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const { user, userProfile, isLoggedIn, signOut } = useAuth()

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        signOut()
    }

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <img src="/logo2.png" alt="Logo" className="h-10 w-auto invert" />
                            </Link>
                           
                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {/* User Section */}
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                {isLoggedIn ? (
                                    // User Dropdown when logged in
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="hover:bg-zinc-800/50 border border-white">
                                                <User className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-64 bg-zinc-800 border-zinc-700">
                                            {/* User Info */}
                                            <div className="px-3 py-2 border-b border-zinc-700">
                                                <div className="text-white font-semibold text-sm">{userProfile?.full_name || user?.email}</div>
                                                <div className="text-red-500 text-xs">Status: {userProfile?.user_type}</div>
                                            </div>
                                            
                                            {/* Navigation Links */}
                                            <Link href="/account?tab=Settings">
                                                <DropdownMenuItem className="text-white hover:bg-zinc-700 cursor-pointer">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Account Settings
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link href="/account?tab=Profile">
                                                <DropdownMenuItem className="text-white hover:bg-zinc-700 cursor-pointer">
                                                    <User className="w-4 h-4 mr-2" />
                                                    View Profile
                                                </DropdownMenuItem>
                                            </Link>
                                            
                                            {/* Admin Link for non-artists */}
                                            {userProfile?.email?.includes('@admin.com') && (
                                                <Link href="/admin">
                                                    <DropdownMenuItem className="text-white hover:bg-zinc-700 cursor-pointer">
                                                        <Shield className="w-4 h-4 mr-2" />
                                                        Admin Panel
                                                    </DropdownMenuItem>
                                                </Link>
                                            )}
                                          
                                    
                                            {/* Logout */}
                                            <DropdownMenuItem 
                                                className="text-white hover:bg-zinc-700 cursor-pointer"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Log Out
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    // Login/Signup buttons when not logged in
                                    <>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className={cn(isScrolled && 'lg:hidden')}>
                                            <Link href="/login">
                                                <span>Login</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            className={cn(isScrolled && 'lg:hidden')}>
                                            <Link href="/register">
                                                <span>Sign Up</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                            <Link href="/register">
                                                <span>Get Started</span>
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}