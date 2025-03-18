import { cn } from "../lib/utils";
import { AnimatedGridPattern } from "../components/magicui/animated-grid-pattern";
export function Background() {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden  bg-blue-300">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,black,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
    </div>
  );
}
