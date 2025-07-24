import Image from "next/image";
import { Button } from "@/components/ui/button";
import dashBoardImg from "@/assets/dashboard.png";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { GlowCursor } from "@/components/ui/glow-cursor";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="relative h-[90vh] w-full ps-28 pe-28 pt-10 overflow-hidden">
        <GlowCursor />
        {/* First div */}
        <div className="relative z-40 w-full h-[40%] flex flex-col gap-8">
          <h1 className="text-6xl font-bold text-center text-white">
            Track, analyze, and manage your finances with ease.
          </h1>
          {/* get started and learn more buttons */}
          <div className="flex justify-center space-x-4 gap-6">
            <Button variant="default">
              <Link href="/sign-up">Get Started</Link>
            </Button>
            <Button variant="default">
              <Link href="/features">Learn More</Link>
            </Button>
          </div>
        </div>
        {/* Second div */}
        <div className="relative z-40 w-full h-[60%] flex flex-col gap-8 rounded-t-3xl overflow-hidden border border-white/20 backdrop-blur-sm bg-white/5">
          <Image
            src={dashBoardImg || "/placeholder.svg"}
            alt="dashboard"
            className="object-cover rounded-t-3xl"
          />
        </div>
      </div>
    </>
  );
}
