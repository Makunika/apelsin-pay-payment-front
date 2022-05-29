import {Stack, Button} from '@mui/material';
import {useSnackbar} from "notistack";
import PropTypes from "prop-types";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {BASE_URL, URL_PAYMENTS} from "../api/ApiSecured";
import {errorHandler} from "../utils/errorUtils";
import {getAuthorizationUrl} from "../api/AuthApi";
import {useAuthState} from "../context";

PaymentForm.propTypes = {
  order: PropTypes.object.isRequired
}

export default function PaymentForm({order}) {
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const authState = useAuthState();
  const isNew = order.orderStatus === 'CREATED'
  const isTinkoff = order.orderType === 'TINKOFF'

  const handleCreateTinkoff = () => {
    const data = {
      orderId: order.id
    }
    axios.post(`${BASE_URL}${URL_PAYMENTS}public/pay/tinkoff`, data)
      .then(res => {
        console.log(res.data)
        window.location.href = res.data.url
      })
      .catch(reason => {
        errorHandler(enqueueSnackbar, reason)
      })
  };

  const handleAuthApelsin = () => {
    if (authState.isLoggedIn) {
      navigate(`/apelsin?id=${order.id}`, { replace: true })
    } else {
      window.location.href = getAuthorizationUrl(order.id)
    }
  };

  if (isNew) {
    return (
      <Stack spacing={3}>
        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={handleAuthApelsin}
        >
          Apelsin Pay
        </Button>
        <Button
          fullWidth
          size="large"
          onClick={handleCreateTinkoff}
          variant="contained"
          color="secondary"
        >
          Tinkoff Pay
        </Button>
      </Stack>
    )
  }

  if (isTinkoff) {
    return (
      <Button
        fullWidth
        size="large"
        variant="contained"
        color="secondary"
        onClick={() => window.location.href = order.payTinkoffUrl}
      >
        Продолжить оплату через Tinkoff Pay
      </Button>
    )
  }

  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
    >
      Продолжить оплату через Apelsin Pay
    </Button>
  )
}
