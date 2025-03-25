"use client";

import Image from "next/image"; // Import the Image component

interface AvatarProps {
    src: string | null | undefined
};

const Avatar: React.FC<AvatarProps> = ({
    src
}) => {
    return (
        <Image
            className="rounded-full"
            height={30} // Use numbers instead of strings
            width={30}
            alt="Avatar"
            src={src || "/images/placeholder.jpg"}
        />
    );
};

export default Avatar;
