'use client';

import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import Container from "../Container";
import { GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiForestCamp, GiIsland, GiWindmill } from "react-icons/gi";
import { MdOutlineVilla } from "react-icons/md";
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";
import { FaSkiing } from "react-icons/fa";
import { BsSnow } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";

export const categories = [
    {
        label: 'Далайн эрэг',
        icon: TbBeach,
        description: 'Энэ үл хөдлөх хөрөнгө нь далайн эрэгт ойрхон!'
    },
    {
        label: 'Ферм',
        icon: GiWindmill    ,
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
        label: 'Арал',
        icon: GiIsland,
        description: 'Энэ үл хөдлөх хөрөнгө арал дээр байдаг!'
    },
    {
        label: 'Гол',
        icon: GiBoatFishing,
        description: 'Энэ байшин голтой ойрхон!'
    },
    {
        label: 'Зугаалга',
        icon: FaSkiing,
        description: 'Энэ газар олон үйл ажиллагаа хийх боломжтой!'
    },
    {
        label: 'Цайз',
        icon: GiCastle,
        description: 'Энэ үл хөдлөх хөрөнгө нь цайзад байдаг!'
    },
    {
        label: 'Амралт',
        icon: GiForestCamp,
        description: 'Энэ газар кемп хийж болно!'
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
        label: 'Амбаар',
        icon: GiBarn,
        description: 'Амбаартай байшин!'
    },
    {
        label: 'Люкс',
        icon: IoDiamond,
        description: 'Тансаг зэрэглэлийн!'
    },
]

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
}

export default Categories;