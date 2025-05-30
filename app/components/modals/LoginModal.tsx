'use client';

import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';
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

import { useRouter } from 'next/navigation';

const LoginModal = () => {
    const router = useRouter();
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        signIn('credentials', {
            ...data,
            redirect: false,
        })
        .then((callback) =>{
            setIsLoading(false);

            if(callback?.ok) {
                toast.success('Амжилттай нэвтэрлээ');
                router.refresh();
                loginModal.onClose();
            }
            if(callback?.error) {
                toast.error(callback.error);
            }
        })
    }

    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Дахин тавтай морил"
                subtitle="Бүртгэлтэй хаягаар нэвтэрнэ үү!" 
            />
            <Input
                id="email"
                label="Email"
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
                required 
            />
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button
                outline
                label="Continue with Google"
                icon={FcGoogle}
                onClick={()=> signIn('google')}
            />
            <Button
                outline
                label="Continue with Github"
                icon={AiFillGithub}
                onClick={()=> signIn('github')}
            />
            <div
                className="
                text-neutral-500
                text-center
                mt-4
                font-light
                "
            >
                <div className="justify-center flex flex-row items-center gap-2">
                    <div>
                       Анх удаа ашиглах гэж байна уу?
                    </div>
                    <div
                        onClick={toggle}
                        className="
                        text-neutral-800
                        cursor-pointer
                        hover:underline
                        "
                    >
                       Бүртгэл үүсгэх
                    </div>
                </div>
            </div>
        </div>
    )


    return ( 
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Нэвтрэх"
            actionLabel="Үргэлжлүүлэх"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default LoginModal;
