"use client"
import { signIn, signOut } from "next-auth/react"
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
export default function TopBar() {
    const session = useSession();
    const router = useRouter();
    const pathname = usePathname();
    //session.data?.user?.image
    const handleSignIn = async () => {
        await signIn(undefined, { callbackUrl: '/' });
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
    };

    const showConvertButton = (pathname === '/' || pathname.startsWith('/video/')) &&  session.data?.user;

    return (
        <header className="px-4 lg:px-6 h-14 flex items-center bg-muted">
      <button 
        onClick={() => router.push('/')} 
        className="flex items-center justify-center text-xl font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-black'}`"
      >
        YT Digest
      </button>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        
        {!session?.data ? (
          <button 
            className="rounded-md bg-primary text-sm font-medium text-primary-foreground shadow p-1 px-2"
            onClick={handleSignIn}
          >
            Sign In
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.data?.user?.image || ''} alt={session.data?.user?.name || 'User'} />
              <AvatarFallback>{session.data?.user?.name || 'U'}</AvatarFallback>
            </Avatar>
            <button 
              className="rounded-md bg-primary text-sm font-medium text-primary-foreground shadow p-1 px-2"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        )}
      </nav>
    </header>
    )
}