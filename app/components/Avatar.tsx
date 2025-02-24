"use client";

import Image from "next/image"; // Import the Image component

const Avatar = () => {
    return (
        <Image
            className="rounded-full"
            height={30} // Use numbers instead of strings
            width={30}
            alt="Avatar"
            src="/images/placeholder.jpg"
        />
    );
};

export default Avatar;
