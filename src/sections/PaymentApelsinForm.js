import {Stack, Button, Typography, CircularProgress, Box} from '@mui/material';
import {useSnackbar} from "notistack";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import apiSecured, {URL_PAYMENTS} from "../api/ApiSecured";
import {errorHandler} from "../utils/errorUtils";
import DepositCard from "./DepositCard";

PaymentApelsinForm.propTypes = {
  order: PropTypes.object.isRequired,
  deposits: PropTypes.array.isRequired
}

export default function PaymentApelsinForm({order, deposits}) {
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const filteredDeposits = deposits.filter(d => !d.lock)
  const [loading, setLoading] = useState(false)

  const handleCreateApelsin = (deposit) => {
    setLoading(true)
    const data = {
      accountNumberFrom: deposit.number,
      orderId: order.id
    }
    apiSecured.post(`${URL_PAYMENTS}pay`, data)
      .then(() => {
        window.location.href = order.redirectUrl
      })
      .catch(reason => {
        errorHandler(enqueueSnackbar, reason)
      })
  };

  return (
    <Stack direction="column" justifyContent="flex-start" spacing={3} >
      <Typography variant="subtitle1" gutterBottom>
        Выберите счет, с которого будут списаны деньги
      </Typography>
      {loading ? (
        <Box alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <div>
          {filteredDeposits.map((deposit, index) => (
            <DepositCard deposit={deposit} key={index} onClick={handleCreateApelsin} />
          ))}
          {filteredDeposits.length === 0 && (
            <Typography variant="body1" >
              У вас нет доступных счетов для списания
            </Typography>
          )}
        </div>
      )}
      <Button
        fullWidth
        variant="outlined"
        onClick={() => navigate(`/?id=${order.id}`)}
        >
        Назад
      </Button>
    </Stack>
  )
}
