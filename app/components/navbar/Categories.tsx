'use client';

import Container from "../Container";
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";

import { MdApartment, MdNaturePeople, MdOutlineVilla } from "react-icons/md";
import { FaBuilding,FaIndustry, FaWarehouse, FaCity, FaStoreAlt } from "react-icons/fa";
import { GiWindmill, GiBoatFishing, GiCaveEntrance, GiCactus } from "react-icons/gi";
import { TbMountain, TbPool } from "react-icons/tb";
import { BsSnow } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";

export const categories = [
  {
    label: 'Орон сууц',
    icon: MdApartment,
    description: 'Амьдрах зориулалттай орон сууц.'
  },
  {
    label: 'Оффис',
    icon: FaBuilding,
    description: 'Ажлын байр, албан тасалгаа.'
  },
  {
    label: 'Ферм',
    icon: GiWindmill,
    description: 'Хөдөө аж ахуйн зориулалттай газар.'
  },
  {
    label: 'Орчин үеийн',
    icon: MdOutlineVilla,
    description: 'Орчин үеийн, тансаг байшин.'
  },
  {
    label: 'Хөдөө',
    icon: TbMountain,
    description: 'Хот суурингаас алслагдсан байршил.'
  },
  {
    label: 'Усан сан',
    icon: TbPool,
    description: 'Усан сантай үл хөдлөх хөрөнгө.'
  },
  {
    label: 'Гол',
    icon: GiBoatFishing,
    description: 'Голын ойролцоо байрлалтай.'
  },
  {
    label: 'Зугаалга',
    icon: MdNaturePeople,
    description: 'Аялал, зугаалгын зориулалттай.'
  },
  {
    label: 'Үйлдвэр',
    icon: FaIndustry,
    description: 'Үйлдвэрлэл явуулах зориулалттай.'
  },
  {
    label: 'Гараж',
    icon: FaWarehouse,
    description: 'Машин хадгалах гараж эсвэл агуулах.'
  },
  {
    label: 'Нийтийн',
    icon: FaCity,
    description: 'Нийтийн эзэмшлийн байр, талбай.'
  },
  {
    label: 'Үйлчилгээний талбай',
    icon: FaStoreAlt,
    description: 'Үйлчилгээний зориулалттай талбай.'
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
