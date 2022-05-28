import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { Stack, TextField} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {useSnackbar} from "notistack";
import PropTypes from "prop-types";
import apiSecured, {URL_INFO_PERSONAL} from "../../../api/ApiSecured";
import "yup-phone";

ProfileUpdateForm.propTypes = {
  profile: PropTypes.object.isRequired
}

export default function ProfileUpdateForm({ profile }) {
  const {enqueueSnackbar} = useSnackbar();

  const RegisterSchema = Yup.object().shape({
    passportNumber: Yup.string()
      .length(6, "Номер паспорта должен состоять из 6 символов")
      .matches(/\d/, "Только цифры!")
      .required('Номер паспорта обязателен'),
    passportSeries: Yup.string()
      .length(4, "Серия паспорта должен состоять из 4 символов")
      .matches(/\d/, "Только цифры!")
      .required('Серия паспорта обязательна'),
  });

  const formik = useFormik({
    initialValues: {
      passportNumber: profile.passportNumber || '',
      passportSeries: profile.passportSeries || '',
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      const data = {
        passportNumber: values.passportNumber,
        passportSeries: values.passportSeries,
        personInfoId: profile.id
      }
      console.log(data)
      return apiSecured.post(`${URL_INFO_PERSONAL}api/persons/conf`, data)
        .then(res => {
            console.log(res)
            enqueueSnackbar("Данные успешно предоставлены, ожидайте подтверждения", {variant: "success" })
            window.location.reload()
          },
          reason => {
            console.log(reason)
            enqueueSnackbar(`Ошибка ${reason.response.statusText}`, {variant: "error"})
          })
    }
  });

  const { errors, touched, values, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Серия паспорта"
              {...getFieldProps('passportSeries')}
              error={Boolean(touched.passportSeries && errors.passportSeries)}
              helperText={touched.passportSeries && errors.passportSeries}
            />

            <TextField
              fullWidth
              label="Номер паспорта"
              {...getFieldProps('passportNumber')}
              error={Boolean(touched.passportNumber && errors.passportNumber)}
              helperText={touched.passportNumber && errors.passportNumber}
            />
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Предоставить
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
