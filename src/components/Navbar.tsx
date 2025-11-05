"use client";
import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/app-logo.png";

const Navbar = () => {


  const NavItems = () => (
    <>
      <NavigationMenuItem>
        <Link
          href="/features"
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/70 rounded-md"
        >
          Features
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link
          href="/how-it-works"
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/70 rounded-md"
        >
          How It Works
        </Link>
      </NavigationMenuItem>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-[10vh] items-center mx-auto px-4">
        <div className="flex-none mr-auto flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-transparent p-1">
              <Image src={Logo} alt="Logo" width={80} height={8} />
            </div>
          </Link>
        </div>

        <NavigationMenu className="md:flex absolute left-1/2 transform -translate-x-1/2">
          <NavigationMenuList>
            <NavItems />
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex-none ml-auto flex items-center gap-2">
          <>
            <Button variant="link" className="flex items-center gap-1">
              <Link href="/sign-up" className="flex items-center gap-1">
                Sign Up
              </Link>
            </Button>
            <Button variant="link" className="flex items-center gap-1">
              <Link href="/login" className="flex items-center gap-1">
                Sign In
              </Link>
            </Button>
          </>
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
              }}
            >
              Log out
            </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
