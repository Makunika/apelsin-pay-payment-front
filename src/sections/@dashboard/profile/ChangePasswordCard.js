import * as PropTypes from "prop-types";
import {useState} from "react";
import {useSnackbar} from "notistack";
import * as Yup from "yup";
import {Form, FormikProvider, useFormik} from "formik";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  Stack,
  TextField
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import apiSecured, {URL_USERS} from "../../../api/ApiSecured";
import {errorHandler} from "../../../utils/errorUtils";
import Iconify from "../../../components/Iconify";

ChangePasswordForm.propTypes = {
  profile: PropTypes.object.isRequired
};

function ChangePasswordForm({ profile }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const {enqueueSnackbar} = useSnackbar()

  const RegisterSchema = Yup.object().shape({
    password: Yup.string()
      .required('Пароль обязателен'),
    newPassword: Yup.string()
      .min(3, "Минимум 3 символа")
      .required('Пароль обязателен'),
  });
  const formik = useFormik({
    initialValues: {
      password: '',
      newPassword: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      console.log(values)
      return apiSecured.put(
        `${URL_USERS}/register/change-password`,
        values
      ).then(res => {
          console.log(res)
          enqueueSnackbar("Пароль успешно заменен", { variant: "success" })
        },
        reason => {
          if (reason.response.status === 403) {
            enqueueSnackbar("Неверный пароль", { variant: "warning" })
          } else {
            errorHandler(enqueueSnackbar, reason)
          }
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
            autoComplete="current-password"
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

          <TextField
            fullWidth
            autoComplete="password"
            type={showNewPassword ? 'text' : 'password'}
            label="Новый пароль"
            {...getFieldProps('newPassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton tab edge="end" onClick={() => setShowNewPassword((prev) => !prev)}>
                    <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.newPassword && errors.newPassword)}
            helperText={touched.newPassword && errors.newPassword}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="outlined"
            loading={isSubmitting}
          >
            Поменять
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}

ChangePasswordCard.propTypes = {
  profile: PropTypes.object.isRequired
};

export default function ChangePasswordCard({ profile }) {
  return (
    <Card>
      <CardHeader title="Сменить пароль" />
      <CardContent>
        <ChangePasswordForm profile={profile} />
      </CardContent>
    </Card>
  );
}