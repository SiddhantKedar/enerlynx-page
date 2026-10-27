import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

const ORANGE = "#e17100";
const inkFor = (tone: Tone) => (tone === "dark" ? "#ffffff" : "#1b1a16");

/** The circuit-trace mark on its own. */
export function LogoMark({ tone = "light", className }: { tone?: Tone; className?: string }) {
  const ink = inkFor(tone);
  return (
    <svg
      aria-hidden="true"
      viewBox="471.19 200.73 302.38 299.99"
      fill="none"
      className={cn("h-7 w-auto", className)}
    >
      <path d="M671.004 409.729H530.381V381.755L555.704 353.48H728.904" stroke={ORANGE} strokeWidth="25.3668" />
      <path d="M483.871 320.218V264.609L512.818 232.615H724.589" stroke={ORANGE} strokeWidth="25.3668" />
      <path d="M664.41 305.744H537.956L483.871 362.115V447.433L509.009 470.286H728.398" stroke={ink} strokeWidth="25.3668" />
      <circle cx="742.691" cy="231.61" r="22.6096" stroke={ORANGE} strokeWidth="16.5436" />
      <circle cx="742.691" cy="352.929" r="22.6096" stroke={ORANGE} strokeWidth="16.5436" />
      <circle cx="742.691" cy="469.837" r="22.6096" stroke={ink} strokeWidth="16.5436" />
    </svg>
  );
}

/** The ENERLYNX wordmark on its own. */
export function LogoWordmark({ tone = "light", className }: { tone?: Tone; className?: string }) {
  const ink = inkFor(tone);
  return (
    <svg aria-hidden="true" viewBox="0 0 1026.23 129.85" fill="none" className={cn("h-4 w-auto", className)}>
      <path d="M892.691 129.85L941.86 63.2554L895.291 0H924.315L959.297 47.9517L996.661 0H1024.82L975.867 63.8119L1026.23 129.85H997.094L958.322 78.7447L920.958 129.85H892.691Z" fill={ink} />
      <path d="M752.451 129.85V0H775.628L852.197 94.3266V0H875.807V129.85H852.63L776.169 34.4102V129.85H752.451Z" fill={ink} />
      <path fillRule="evenodd" clipRule="evenodd" d="M662.205 129.85V73.7362L608.704 0H636.429L674.876 53.7022L686.573 73.9217V129.85H662.205Z" fill={ink} />
      <path d="M740.074 0H713.107L680.822 45.3499L692.777 65.3499L740.074 0Z" fill={ORANGE} />
      <path d="M537.312 129.85V0H561.571V110.743H627.635V129.85H537.312Z" fill={ink} />
      <path d="M402.138 129.85V0H459.429C469.971 0 479.068 1.57675 486.721 4.73025C494.447 7.82191 500.403 12.243 504.591 17.9935C508.851 23.744 510.981 30.5766 510.981 38.4912C510.981 44.9219 509.356 50.6105 506.107 55.5572C502.93 60.5039 498.454 64.5848 492.678 67.8002C486.902 70.9537 480.223 73.0869 472.642 74.1999L518.345 129.85H488.996L447.083 77.4462H426.397V129.85H402.138ZM426.397 60.1947H455.422C465.241 60.1947 472.859 58.4015 478.274 54.8152C483.761 51.2289 486.505 46.0967 486.505 39.4187C486.505 32.5552 484.05 27.2066 479.14 23.373C474.303 19.5393 466.974 17.6225 457.155 17.6225H426.397V60.1947Z" fill={ink} />
      <path d="M278.175 129.85V0H376.188V18.3645H302.434V53.4239H366.116V70.7682H302.434V111.3H376.838V129.85H278.175Z" fill={ink} />
      <path d="M123.963 129.85V0H147.139L223.709 94.3266V0H247.318V129.85H224.142L147.681 34.4102V129.85H123.963Z" fill={ink} />
      <path fillRule="evenodd" clipRule="evenodd" d="M0 53.4239V129.85H98.6628V111.3H24.2596V70.7682H87.9409V53.4239H24.2596H0ZM24.2596 18.3645H98.013V0H0V18.3645H24.2596Z" fill={ink} />
    </svg>
  );
}

/** Mark + wordmark lockup. */
export function Logo({ tone = "light", className }: { tone?: Tone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} />
      <LogoWordmark tone={tone} />
    </span>
  );
}
