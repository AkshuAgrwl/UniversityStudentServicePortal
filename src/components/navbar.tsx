import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";

import { MenuIcon } from "lucide-react";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "@/components/logout-button";
import ThemeToggle from "@/components/theme-switcher";

type NavigationItem = {
  title: string;
  href: string;
}[];

const Navbar = async ({
  navigationData,
}: {
  navigationData: NavigationItem;
}) => {
  const session = await auth();

  return (
    <header className="bg-background sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-7 sm:px-6">
        <div className="text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16">
          <Logo className="text-foreground gap-3" />
          {navigationData.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="hover:text-primary max-md:hidden"
            >
              {item.title}
            </Link>
          ))}
          {session?.user && (
            <Link
              href="/dashboard"
              className="hover:text-primary max-md:hidden"
            >
              Dashboard
            </Link>
          )}
          {session?.user ? (
            <>
              <div className="flex flex-row gap-4 justify-center items-center">
                <Image
                  src={session.user.image || ""}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                {session.user.name}
              </div>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" className="hover:text-primary max-md:hidden">
              Login
            </Link>
          )}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <span>
                  <MenuIcon />
                </span>
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <Link href={item.href}>{item.title}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
