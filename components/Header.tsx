import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Briefcase, HomeIcon, MessageSquare, SearchIcon, UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const Header = () => {
    return (
        <div className="flex items-center p-2 max-w-6xl mx-auto">
            <Image
                className="rounded-lg"
                src="https://cdn-icons-png.flaticon.com/256/174/174857.png"
                width={40}
                height={40}
                alt="logo"
            />

            <div className="flex-1">
                <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md mx-2 max-w-96">
                    <SearchIcon className="h-4 text-gray-600" />
                    <input type="text" placeholder="Search" className="bg-transparent outline-none" />
                </form>
            </div>

            <div className="flex items-center space-x-4 px-6">
                <Link href="/" className="icon">
                    <HomeIcon className="h-5" />
                    <p>Home</p>
                </Link>
                <Link href="/" className="icon hidden md:flex">
                    <UserIcon className="h-5" />
                    <p>Network</p>
                </Link>
                <Link href="/" className="icon hidden md:flex">
                    <Briefcase className="h-5" />
                    <p>Jobs</p>
                </Link>
                <Link href="/" className="icon">
                    <MessageSquare className="h-5" />
                    <p>Messaging</p>
                </Link>

                {/* User button if signed in  */}
                <SignedIn>
                    <UserButton />
                </SignedIn>

                {/* Sign In button if not signed in */}
                <SignedOut>
                    <Button asChild variant="secondary">
                        {/* asChild -> when need to click anywhere on button(corner, middle,edge) it works, without asChild it'll only work on middle */}
                        <SignInButton />
                    </Button>
                </SignedOut>
            </div>

        </div>
    )
}

export default Header