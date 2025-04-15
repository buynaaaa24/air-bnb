'use client';
import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal"
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import qs from "query-string";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";

enum STEPS{
    LOCATION=0,
    DATE=1,
    INFO=2
}

const SearchModal = () => {
    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    const [location, setLocation] = useState<CountrySelectValue>()
    const [step, setStep] = useState(STEPS.LOCATION);
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false,
    }), [location]);

    const onBack = useCallback(() => {
        setStep((value) => value -1);
    }, []);

    const onNext = useCallback(() => {
        setStep((value) => value +1);
    }, []);

    const onSubmit = useCallback(async () => {
        if (step !== STEPS.INFO) {
            return onNext();
        }

        let currentQuery = {};

        if(params) {
            currentQuery = qs.parse(params.toString());
        }

        const updatedQuery: any = {
            ... currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount
        };

        if (dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate);
        }

        if (dateRange.endDate){
            updatedQuery.endDate = formatISO(dateRange.endDate);
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true});

        setStep(STEPS.LOCATION);
        searchModal.onClose();
        
        router.push(url);
    }, [
        step,
        searchModal,
        location,
        guestCount,
        roomCount,
        bathroomCount,
        dateRange,
        onNext,
        params
    ]);

    const actionLabel = useMemo(()=>{
        if(step === STEPS.INFO){
            return 'Хайх';
        }

        return 'Дараагийн';
    },[step]);

    const secondaryActionLabel = useMemo(() => {
        if(step ===STEPS.LOCATION) {
            return undefined;
        }

        return 'Буцах';
    }, [step]);

    let BodyContent = (
        <div className="flex flex-col gap-8">
            <Heading 
                title="Та хаана байр түрээслэхийг хүсч байна вэ?"
                subtitle="Хүссэн газраа төгс гэрээ олоорой"
            />
            <CountrySelect
                value={location}
                onChange={(value) =>
                    setLocation(value as CountrySelectValue)
                }
            />
            <hr />
            <Map center={location?.latlng} />
        </div>
    )

    if(step === STEPS.DATE) {
        BodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Хэзээ түрээслэхээр төлөвлөж байна вэ?"
                    subtitle="Өдөр судраа зөв зохицуулсан биз?"
                />
                <Calendar
                    value={dateRange}
                    onChange={(value)=> setDateRange(value.selection)}
                />
            </div>
        )
    }

    if( step === STEPS.INFO) {
        BodyContent =(
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Илүү дэлгэрэнгүй мэдээлэл"
                    subtitle="Өөрт тохирсон гэрээ олоорой"
                />
                <Counter
                    title="Хүний тоо"
                    subtitle="Хэр олуулаа түрээслэх вэ?"
                    value={guestCount}
                    onChange={(value)=> setGuestCount(value)}
                />
                <Counter
                    title="Өрөөний тоо"
                    subtitle="Таньд хэдэн өрөө хэрэгтэй вэ?"
                    value={roomCount}
                    onChange={(value)=> setRoomCount(value)}
                />
                <Counter
                    title="Угаалгын өрөө"
                    subtitle="Таньд хэдэн угаалгын өрөө хэрэгтэй вэ?"
                    value={bathroomCount}
                    onChange={(value)=> setBathroomCount(value)}
                />
            </div>
        )
    }


    return(
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filters"
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined: onBack}
            body={BodyContent}
        />
    );
}

export default SearchModal;