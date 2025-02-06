'use client';

import { FormEditUser, schemaEditUser } from '@/schema/user-schema';
import { getUserByToken, updateUserService } from '@/service/user-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlayCircle } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { regexPhone } from '../../../../../util/validate';
import { users } from '@prisma/client';
import { getUserByIdRepository } from '@/repository/user-repository';

export default function UserConfiguracao() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<users | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormEditUser>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(schemaEditUser),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      facebook: '',
      instagram: '',
      telephone: '',
      whatsapp: ''
    }
  });

  useEffect(() => {
    const getUserToken = async () => {
      const userToken = await getUserByToken();
      const user = await getUserByIdRepository(userToken.id);
      if (user) {
        setUser(user);
        reset({
          name: user.name || '',
          email: user.email || '',
          address: user.address || '',
          facebook: user.facebook || '',
          instagram: user.instagram || '',
          telephone: user.telephone || '',
          whatsapp: user.whatsapp || ''
        });
      }
    };
    getUserToken();
  }, [reset]);

  const handleSubmitForm = async (userEdit: FormEditUser) => {
    setLoading(true);

    try {
      if (!user) return;
      const userUpdate: users = {
        name: userEdit.name,
        email: userEdit.email,
        address: userEdit.address,
        facebook: userEdit.facebook,
        instagram: userEdit.instagram,
        whatsapp: userEdit.whatsapp
          ? userEdit.whatsapp.replace(/\D/g, '')
          : null,
        telephone: userEdit.telephone
          ? userEdit.telephone.replace(/\D/g, '')
          : null,
        type: 0,
        id: user.id,
        password: '',
        email_confirmed: false,
        active: false
      };
      await updateUserService(userUpdate);
    } catch (error: unknown) {
      console.error('falha ao salvar usuário', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div>
        <div className="flex flex-col items-start justify-start">
          <h2 className="font-bold text-3xl">Sua conta</h2>
        </div>
        <div>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="flex flex-col w-72">
              <label htmlFor="name">Nome</label>
              <TextField
                id="name"
                placeholder="Nome"
                type="text"
                variant="outlined"
                {...register('name')}
                error={!!errors.name?.message}
                helperText={errors.name?.message}
                sx={{
                  marginBottom: 2
                }}
              />
            </div>
            <div className="flex flex-col w-72">
              <label htmlFor="email">Email</label>
              <TextField
                id="email"
                placeholder="Email"
                type="email"
                variant="outlined"
                {...register('email')}
                error={!!errors.email?.message}
                helperText={errors.email?.message}
                sx={{
                  marginBottom: 2
                }}
              />
            </div>
            <div className="flex flex-col w-72">
              <label htmlFor="address">Endereço</label>
              <TextField
                id="address"
                placeholder="Endereço"
                type="text"
                variant="outlined"
                {...register('address')}
                error={!!errors.address?.message}
                helperText={errors.address?.message}
                sx={{
                  marginBottom: 2
                }}
              />
            </div>
            <div className="flex flex-col w-72">
              <label htmlFor="telephone">Telefone</label>
              <TextField
                id="telephone"
                placeholder="Telefone"
                type="text"
                variant="outlined"
                {...register('telephone', {
                  onChange: (e) =>
                    setValue('telephone', regexPhone(e.target.value))
                })}
                error={!!errors.telephone?.message}
                helperText={errors.telephone?.message}
                sx={{
                  marginBottom: 2
                }}
              />
            </div>
            <div className="flex flex-col w-72">
              <label htmlFor="whatsapp">Whatsapp</label>
              <TextField
                id="whatsapp"
                placeholder="Whatsapp"
                type="text"
                variant="outlined"
                {...register('whatsapp', {
                  onChange: (e) =>
                    setValue('whatsapp', regexPhone(e.target.value))
                })}
                error={!!errors.whatsapp?.message}
                helperText={errors.whatsapp?.message}
                sx={{
                  marginBottom: 2
                }}
              />
            </div>
            <div className="flex flex-col w-72">
              <label htmlFor="facebook">Facebook</label>
              <TextField
                id="facebook"
                placeholder="/Facebook"
                type="text"
                variant="outlined"
                {...register('facebook')}
                error={!!errors.facebook?.message}
                helperText={errors.facebook?.message}
                sx={{
                  marginBottom: 2
                }}
              />
            </div>
            <div className="flex flex-col w-72">
              <label htmlFor="instagram">Instagram</label>
              <TextField
                id="instagram"
                placeholder="@Instagram"
                type="text"
                variant="outlined"
                {...register('instagram')}
                error={!!errors.instagram?.message}
                helperText={errors.instagram?.message}
                sx={{
                  marginBottom: 2
                }}
              />
            </div>
            <Button
              type="submit"
              color="primary"
              loading={loading}
              loadingPosition="center"
              endIcon={<PlayCircle />}
              variant="contained"
              sx={{
                width: 150,
                textTransform: 'none'
              }}
            >
              Salvar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
