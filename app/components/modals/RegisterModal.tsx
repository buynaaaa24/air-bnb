'use client';

import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import toast from 'react-hot-toast';
import Button from '../Button';
import { signIn } from 'next-auth/react';

const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);
    const [showTerms, setShowTerms] = useState(false); 

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/register', data)
            .then(() => {
                toast.success('Амжилттай!');
                setShowTerms(true); 
            })
            .catch(() => {
                toast.error('Буруу!!!');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const toggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
    }, [loginModal, registerModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Тавтай морил" subtitle="Бүртгэл үүсгэх!" />
            <Input
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="name"
                label="Нэвтрэх нэр"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="password"
                type="password"
                label="НУУЦ ҮГ"
                disabled={isLoading}
                register={register}
                errors={errors}
                required={true}
                validation={{
                    minLength: {
                    value: 8,
                    message: "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой"
                    }
                }}
                />


        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button
                outline
                label="Continue with Google"
                icon={FcGoogle}
                onClick={() => signIn('google')}
            />
            <Button
                outline
                label="Continue with Github"
                icon={AiFillGithub}
                onClick={() => signIn('github')}
            />
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="justify-center flex flex-row items-center gap-2">
                    <div>Бүртгэл байгаа юу?</div>
                    <div
                        onClick={toggle}
                        className="text-neutral-800 cursor-pointer hover:underline"
                    >
                        Нэвтрэх
                    </div>
                </div>
            </div>
        </div>
    );

   const termsContent = (
  <div className="max-h-[400px] overflow-y-auto text-neutral-700 space-y-4">
    <p>Та энэхүү үйлчилгээг ашигласнаар дараах нөхцлүүдийг зөвшөөрч байгаа болно:</p>
    <ul className="list-disc list-inside space-y-2">
      <li>Хувийн мэдээллийг үнэн зөв оруулах.</li>
      <li>Системийг зүй зохистой ашиглах.</li>
      <li>Үйлчилгээний нөхцлийг мөрдөх.</li>
      <li>Зөрчил гаргасан тохиолдолд хариуцлага хүлээх.</li>
    </ul>

    <hr className="my-4" />

    <h3 className="font-semibold">Монгол Улсын Түрээсийн тухай хуулийн товч агуулга:</h3>
    <ul className="list-disc list-inside space-y-2">
      <li>
        <strong>Түрээслүүлэгч:</strong> Түрээслэх эд хөрөнгөө ашиглах нөхцөл, хугацаа болон үнийг гэрээгээр тогтооно.
      </li>
      <li>
        <strong>Түрээслэгч:</strong> Түрээсийн эд хөрөнгийг зөв зохистой хэрэглэж, гэрээнд заасан үүргийг биелүүлнэ.
      </li>
      <li>
        Түрээсийн хугацаа дуусахад эд хөрөнгийг бүрэн бүтэн байдалтай буцааж өгөх үүрэгтэй.
      </li>
      <li>
        Түрээсийн төлбөрийг хугацаанд нь төлөөгүй бол нэмэгдэл төлбөр болон гэрээ цуцлах үндэслэл болно.
      </li>
      <li>
        Түрээсийн гэрээ нь хоёр талын зөвшилцлөөр бичгээр байгуулагдана.
      </li>
      <li>
        Эвдрэл гэмтэл гарсан тохиолдолд аль тал хариуцах талаар гэрээнд тусгагдсан байх ёстой.
      </li>
    </ul>

    <p className="text-sm text-neutral-500 mt-4">
      Та бүртгүүлснээр дээрх нөхцөл, Монгол Улсын хууль тогтоомжийг хүлээн зөвшөөрсөнд тооцно.
    </p>
  </div>
);

    return (
        <>
            <Modal
                disabled={isLoading}
                isOpen={registerModal.isOpen && !showTerms}
                title="Бүртгүүлэх"
                actionLabel="Үргэлжлүүлэх"
                onClose={registerModal.onClose}
                onSubmit={handleSubmit(onSubmit)}
                body={bodyContent}
                footer={footerContent}
            />
            <Modal
                isOpen={showTerms}
                title="Нөхцөл хүлээн зөвшөөрөх"
                actionLabel="Зөвшөөрч байна"
                onClose={() => {
                    setShowTerms(false);
                    registerModal.onClose();
                    loginModal.onOpen();
                }}
                onSubmit={() => {
                    setShowTerms(false);
                    registerModal.onClose();
                    loginModal.onOpen();
                }}
                body={termsContent}
            />

        </>
    );
};

export default RegisterModal;
