import Image from "next/image";

import MMELogo from "@/assets/logo_partial.png";

import { cn } from "@/utils";

const Logo = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image src={MMELogo} alt="MME Logo" width={50} />
      {children && <span className="text-xl font-semibold">{children}</span>}
    </div>
  );
};

export default Logo;
