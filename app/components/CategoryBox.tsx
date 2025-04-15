'use client';

import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import qs from "query-string";

// Mapping Mongolian labels to English labels
const categoryLabelMap: Record<string, string> = {
  'Далайн эрэг': 'Beach',
  'Ферм': 'Farm',
  'Орчин үеийн': 'Modern',
  'Хөдөө': 'Countryside',
  'Усан сан': 'Pool',
  'Арал': 'Island',
  'Гол': 'Lake',
  'Зугаалга': 'Skiing',
  'Цайз': 'Castle',
  'Амралт': 'Camping',
  'Арктик': 'Arctic',
  'Агуй': 'Cave',
  'Цөл': 'Desert',
  'Амбаар': 'Barn',
  'Люкс': 'Luxury',
};

interface CategoryBoxProps {
    icon: IconType;
    label: string;
    selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    icon: Icon,
    label,
    selected
}) => {
    const router = useRouter();
    const params = useParams();

    const handleClick = useCallback(() => {
        // Convert Mongolian label to English for the URL
        const englishLabel = categoryLabelMap[label] || label;

        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        const updatedQuery: any = {
            ...currentQuery,
            category: englishLabel
        };

        // If the category is already selected, remove it from the query
        if (params?.category === englishLabel) {
            delete updatedQuery.category;
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true });

        router.push(url);
    }, [label, params, router]);

    return (
        <div
            onClick={handleClick}
            className={`
                flex
                flex-col
                items-center
                justify-center
                gap-2
                p-3
                border-b-2
                hover:text-neutral-800
                transition
                cursor-pointer
                ${selected ? 'border-b-neutral-800' : 'border-transparent'}
                ${selected ? 'text-neutral' : 'text-neutral-500'}
            `}
        >
            <Icon size={26} />
            <div className="font-medium text-sm">
                {label}
            </div>
        </div>
    );
}

export default CategoryBox;
