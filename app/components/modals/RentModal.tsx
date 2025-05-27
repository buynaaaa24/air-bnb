'use client';
import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValue, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const router = useRouter();
    const rentModal = useRentModal();

    const [step , setStep] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: ''
        }
    });

    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location]);

    const setCustomValue = (id: string, value : any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate:true
        })
    }

    const onBack = () => {
        setStep((value) => value - 1);
    }

    const onNext = () => {
        setStep((value) => value + 1);
    }

    const onSubmit : SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);

        axios.post('/api/listings', data)
        .then(() => {
            toast.success('Амжилттай бүртгэгдлээ!');
            router.refresh();
            reset();
            setStep(STEPS.CATEGORY);
            rentModal.onClose();
        })
        .catch(() => {
            toast.error('Бүртгэгдсэнгүй.');
        }).finally(() => {
            setIsLoading(false);
        })        

    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Үүсгэх';
        }

        return 'Дараах';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if(step ===STEPS.CATEGORY) {
            return undefined;
        }

        return 'Буцах';
    },[step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Эдгээрийн аль нь таны байрыг хамгийн сайн тодорхойлж байна вэ?"
                subtitle="Ангилал сонгоно уу"
            />
            <div 
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-3
                    max-h-[50vh]
                    overflow-y-auto
                    "
                >
                {categories.map((item) => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput
                            onClick={(category) => 
                                setCustomValue('category', category)}
                            selected={category === item.label}
                            label={item.label}
                            icon={item.icon}
                        /> 
                    </div>
                ))}
            </div>
        </div>
    )

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Танай байр хаана байрладаг вэ?"
                    subtitle="Таны байрыг олоход тусална уу!"
                    />
                    <CountrySelect
                        value={location}
                        onChange={(value) => setCustomValue('location', value)}
                    />
            <Map
                center={location?.latlng} 
            />
            </div>
        )
    }

    if(step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Үндсэн мэдээлэл"
                    subtitle="Онцлох зүйлс юу вэ?"
                />
                <Counter
                    title="Хүний тоо"
                    subtitle="Хэр их хүн байхад тохиромжтой вэ?"
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}
                />
                <hr />
                <Counter
                    title="Өрөөний тоо"
                    subtitle="Хэдэн өрөөтэй вэ?"
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}
                />
                <hr />
                <Counter
                    title="Ариун цэврийн өрөө"
                    subtitle="Хэдэн ариун цэврийн өрөөтэй вэ?"
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                />
            </div>
        )
    }

        if(step === STEPS.IMAGES) {
            bodyContent = (
                <div className="flex flex-col gap-8">
                    <Heading
                        title="Байрны зургийг оруулна уу"
                        subtitle="Танайхийг илтгэх зургууд!"
                    />
                    <ImageUpload
                        value={imageSrc}
                        onChange={(value) => setCustomValue('imageSrc', value)}
                    />
                </div>
            )
        }
        
        if (step === STEPS.DESCRIPTION) {
            bodyContent = (
                <div className="flex flex-col gap-8">
                    <Heading
                        title="Та өөрийн байраа тодорхой дүрсэлвэл?"
                        subtitle="Товч, тодорхой байвал сайн!"
                    />
                    <Input
                        id="title"
                        label="Title"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    /> 
                    <hr />
                    <Input
                        id="description"
                        label="Description"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    /> 
                </div>
            )
        }

        if (step === STEPS.PRICE) {
            bodyContent = (
                <div className="flex flex-col gap-8">
                    <Heading
                        title="Түрээслэх үнэ"
                        subtitle="Түрээслэх үнээ бичнэ үү?"
                    />
                    <Input
                       id="price"
                       label="Price"
                       formatPrice={true}
                       type="number"
                       disabled={isLoading}
                       register={register}
                       errors={errors}
                       required
                    />
                </div>
            )
        }

    return (
        <Modal
        isOpen={rentModal.isOpen}
        onClose={rentModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
        title="Байраа түрээслүүлэх!"
        body={bodyContent}
        />
     );
}

export default RentModal;