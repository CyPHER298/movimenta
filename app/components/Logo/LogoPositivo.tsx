import Image from "next/image";

interface LogoProps {
  direction?: string;
}

export const LogoPositivo = ({ direction }: LogoProps) => (
  <Image
    src={`/logo_${direction}_positivo.png`}
    height={180}
    width={180}
    alt="logo-img"
    className="lg:hidden"
  />
);
