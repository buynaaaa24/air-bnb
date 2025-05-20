'use client';

import Container from "../Container";
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";

import { MdApartment, MdNaturePeople, MdOutlineVilla } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import { GiWindmill, GiBoatFishing, GiCaveEntrance, GiCactus } from "react-icons/gi";
import { TbMountain, TbPool } from "react-icons/tb";
import { BsSnow } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";

export const categories = [
    {
        label: 'Орон сууц',
        icon: MdApartment,
        description: 'Энэ үл хөдлөх хөрөнгө нь орон сууцны зориулалттай!'
    },
    {
        label: 'Оффис',
        icon: FaBuilding,
        description: 'Энэ үл хөдлөх хөрөнгө нь оффисын зориулалттай!'
    },
    {
        label: 'Ферм',
        icon: GiWindmill,
        description: 'Энэ байшин салхин тээрэмтэй!'
    },
    {
        label: 'Орчин үеийн',
        icon: MdOutlineVilla,
        description: 'Энэ өмч нь орчин үеийн шийдэлтэй!'
    },
    {
        label: 'Хөдөө',
        icon: TbMountain,
        description: 'Энэ өмч нь хөдөө байдаг!'
    },
    {
        label: 'Усан сан',
        icon: TbPool,
        description: 'Энэ байшин усан сантай!'
    },
    {
        label: 'Гол',
        icon: GiBoatFishing,
        description: 'Энэ байшин голтой ойрхон!'
    },
    {
        label: 'Зугаалга',
        icon: MdNaturePeople,
        description: 'Энэ газар олон үйл ажиллагаа хийх боломжтой!'
    },
    {
        label: 'Арктик',
        icon: BsSnow,
        description: 'Энэ өмч нь Антарктикт байдаг!'
    },
    {
        label: 'Агуй',
        icon: GiCaveEntrance,
        description: 'Агуйд байрласан байшин!'
    },
    {
        label: 'Цөл',
        icon: GiCactus,
        description: 'Энэ байшин цөлд байдаг!'
    },
    {
        label: 'Люкс',
        icon: IoDiamond,
        description: 'Тансаг зэрэглэлийн!'
    },
];

const Categories = () => {
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();

    const isMainPage = pathname === '/';

    if (!isMainPage) {
        return null;
    }

    return (
        <Container>
            <div
                className="
                    pt-4
                    flex
                    flex-row
                    items-center
                    justify-between
                    overflow-x-auto
                "
            >
                {categories.map((item) => (
                    <CategoryBox
                        key={item.label}
                        label={item.label}
                        selected={category === item.label}
                        icon={item.icon}
                    />
                ))}
            </div>
        </Container>
    );
};

export default Categories;
