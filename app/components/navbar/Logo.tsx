'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
    const router = useRouter();

    return (
        <Image
            onClick={() => router.push('/')}
            alt="Logo"
            height="100"
            width="100"
            src="/images/chtlogo.png"
        />



    )
}

export default Logo;