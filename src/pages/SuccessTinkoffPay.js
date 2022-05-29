// material
import { styled } from '@mui/material/styles';
import {CircularProgress, Container, Stack, Typography} from '@mui/material';
// components
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useSnackbar} from "notistack";
import axios from "axios";
import Page from '../components/Page';
import {BASE_URL, URL_PAYMENTS} from "../api/ApiSecured";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function SuccessTinkoffPay() {
  const navigate = useNavigate();
  const {search} = useLocation();
  const {enqueueSnackbar} = useSnackbar();
  const params = new URLSearchParams(search);
  const number = params.get("number")
  const transactionId = params.get("id")
  const orderId = params.get("orderId")
  const redirectUrl = params.get("redirect")

  if (!number || !transactionId || !orderId || !redirectUrl) {
    navigate("/", { replace: true })
  }

  useEffect(() => {
    const data = {
      orderId
    }
    axios.post(`${BASE_URL}${URL_PAYMENTS}/public/pay/tinkoff/redirect`, data)
      .then(() => {
        setTimeout(() => {
          window.location.href = redirectUrl
        }, 1500)
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar("Что то пошло не так", { variant: "error" })
        navigate(`/?id=${orderId}`, { replace: true })
      })
  }, [])

  return (
    <RootStyle title="Подтверждение оплаты | Apelsin pay">
      <Container>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="h4" gutterBottom>
            Подтверждаем оплату
          </Typography>
          <CircularProgress />
        </Stack>
      </Container>
    </RootStyle>
  );
}
