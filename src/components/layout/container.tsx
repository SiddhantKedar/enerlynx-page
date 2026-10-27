import { cn } from "@/lib/utils";

/** Page-width wrapper. Every section's content sits inside one of these. */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[76rem] px-5 sm:px-8", className)}
      {...props}
    />
  );
}
