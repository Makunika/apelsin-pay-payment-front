import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import {useLocation, useNavigate} from 'react-router-dom';
import {Stack, TextField, IconButton, InputAdornment, Box, Typography, Button} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from "axios";
import {useSnackbar} from "notistack";
import {motion} from "framer-motion";
import {BASE_URL, URL_INFO_PERSONAL, URL_USERS} from "../../../api/ApiSecured";
import {MotionContainer, varBounceIn} from "../../../components/animate";
import {errorHandler} from "../../../utils/errorUtils";
import Iconify from "../../../components/Iconify";

export default function CreateNewPasswordForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const {enqueueSnackbar} = useSnackbar();
  const {search} = useLocation();
  const token = search.substring(1);
  
  const schema = Yup.object().shape({
    password: Yup.string()
      .required('Обязателен')
  });

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const data = {
        newPassword: values.password,
        token
      }
      return axios.post(
        `${BASE_URL}${URL_USERS}public/remember/new-password`,
        data,
        {
          responseType: "json"
        }
      ).then(() => {
          navigate('/', { replace: true });
        },
        reason => {
          errorHandler(enqueueSnackbar, reason)
        })
    }
  });

  const { errors, touched, values, handleSubmit, isSubmitting, getFieldProps } = formik;
  
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="password"
            type={showPassword ? 'text' : 'password'}
            label="Пароль"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Сохранить
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
