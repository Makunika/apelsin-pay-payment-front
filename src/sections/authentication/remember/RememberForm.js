import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import {Stack, TextField, IconButton, InputAdornment, Box, Typography, Button} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from "axios";
import {useSnackbar} from "notistack";
import {motion} from "framer-motion";
import {BASE_URL, URL_INFO_PERSONAL, URL_USERS} from "../../../api/ApiSecured";
import {MotionContainer, varBounceIn} from "../../../components/animate";
import {errorHandler} from "../../../utils/errorUtils";

export default function RememberForm() {
  const [isSend, setSend] = useState(false)
  const {enqueueSnackbar} = useSnackbar();

  const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email должен быть валидным!')
      .required('Email обязателен')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => axios.post(
        `${BASE_URL}${URL_USERS}public/remember`,
        values,
        {
          responseType: "json"
        }
      ).then(() => {
          setSend(true)
        },
        reason => {
          errorHandler(enqueueSnackbar, reason)
        })
  });

  const { errors, touched, values, handleSubmit, isSubmitting, getFieldProps } = formik;

  if (isSend) {
    return (
      <MotionContainer initial="initial" open>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <motion.div variants={varBounceIn}>
            <Typography variant="h3" paragraph>
              Письмо отправлено
            </Typography>
          </motion.div>
          <Typography sx={{ color: 'text.secondary' }} mb={5}>
            Проверьте почту {values.email}
          </Typography>
        </Box>
      </MotionContainer>
    )
  }
  
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Восстановить пароль
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
