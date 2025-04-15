'use client';

import { Range } from 'react-date-range';
import Calendar from '../inputs/Calendar';
import Button from '../Button';

interface ListingReservationProps {
    price: number;
    dateRange: Range;
    totalPrice: number;
    onChangeDate: (value: Range) => void;
    onSubmit: () => void;
    disabled?: boolean;
    disabledDates: Date[];
}

const ListingReservation: React.FC<ListingReservationProps> = ({
    price,
    dateRange,
    totalPrice,
    onChangeDate,
    onSubmit,
    disabled,
    disabledDates
}) => {
    const formatter = new Intl.NumberFormat('mn-MN', {
        style: 'currency',
        currency: 'MNT',
        minimumFractionDigits: 0,
    });

    return (
        <div
            className="
                bg-white
                rounded-xl
                border-[1px]
                border-neutral-200
                overflow-hidden
            "
        >
            <div className="flex flex-row items-center gap-1 p-4">
                <div className="text-2xl font-semibold">
                    {formatter.format(price)}
                </div>
                <div className="font-light text-neutral-600">
                    Өдөр
                </div>
            </div>
            <hr />
            <Calendar
                value={dateRange}
                disabledDates={disabledDates}
                onChange={(value) => onChangeDate(value.selection)}
            />
            <hr />
            <div className="p-4">
                <Button
                    disabled={disabled}
                    label="Захиалах"
                    onClick={onSubmit}
                />
            </div>

            <div
                className="
                    p-4
                    flex
                    flex-row
                    items-center
                    justify-between
                    font-semibold
                    text-l
                "
            >
                <div>
                    Нийт
                </div>
                <div>
                    {formatter.format(totalPrice)}
                </div>
            </div>
        </div>
    );
};

export default ListingReservation;
