import PropTypes from 'prop-types';
// material
import {
  Card,
  Typography,
  CardHeader,
  CardContent,
  Button,
  Stack,
  DialogTitle,
  Dialog,
  DialogContent, DialogActions, Box, Divider, Grid
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  TimelineDot, TimelineOppositeContent
} from '@mui/lab';
// utils
import {useSnackbar} from "notistack";
import {useEffect, useState} from "react";
import { fDateTime } from '../../../utils/formatTime';
import API_SECURED, {URL_TRANSACTION} from "../../../api/ApiSecured";
import {fCurrencyByEnum, fStatusTransaction, fTypeTransaction} from "../../../utils/formatEnum";
import {fNumberDeposit} from "../../../utils/formatNumber";
import SimpleDataVisible from "../../../components/SimpleDataVisible";

// ----------------------------------------------------------------------

TransactionItemDetail.propTypes = {
  item: PropTypes.object.isRequired,
  isDeposit: PropTypes.bool.isRequired,
};

function TransactionItemDetail({ item, isDeposit }) {
  const { commissionRate, commissionValue, ownerUsername, created, currency, currencyFrom, currencyTo, fromNumber, id, innerFrom, innerTo, money, moneyWithCommission, reasonCancel, status, system, toNumber, type, tinkoffPayUrl } = item;
  return (
    <Stack justifyContent="flex-start" direction="column">
      <Box mb={2} >
        <Typography variant="subtitle1">{isDeposit ? "Пополнение" : "Перевод"}</Typography>
      </Box>
      <SimpleDataVisible
        label="Дата платежа"
        text={fDateTime(new Date(created))}
      />
      <SimpleDataVisible
        label="Платеж"
        text={`${money} ${fCurrencyByEnum(currency).label}`}
      />
      {moneyWithCommission != null && (
        <SimpleDataVisible
        label="Платеж c комиссией для отправителя"
        text={`${moneyWithCommission} ${fCurrencyByEnum(currency).label}`}
        />
      )}
      <SimpleDataVisible
        label="Статус"
        text={fStatusTransaction(status)}
      />
      {status === 'CANCELED' && (
        <SimpleDataVisible
          colorTitle="text.error"
          label="Причина отмены"
          text={reasonCancel || "Нет"}
        />
      )}
      <SimpleDataVisible
        label="Тип"
        text={fTypeTransaction(type)}
      />
      <SimpleDataVisible
        label="Отправитель"
        // eslint-disable-next-line no-nested-ternary
        text={ownerUsername}
      />
      <SimpleDataVisible
        label="Отправитель"
        text={innerFrom ? fNumberDeposit(fromNumber) : "Внешний"}
      />
      <SimpleDataVisible
        label="Получатель"
        // eslint-disable-next-line no-nested-ternary
        text={innerTo ? fNumberDeposit(toNumber) : (system ? "Система" : "Внешний")}
      />
      <SimpleDataVisible
        label="Комиссия в процентах для отправителя"
        text={`${commissionRate * 100} %`}
      />
      {commissionValue != null && (
        <SimpleDataVisible
          label="Комиссия для отправителя"
          text={`${commissionValue} ${fCurrencyByEnum(currency).label}`}
        />
      )}
      {tinkoffPayUrl && status === 'WAIT' && (
        <Button fullWidth variant="contained" href={tinkoffPayUrl}>
          Оплатить через Тинькофф
        </Button>
      )}
    </Stack>
  );
}

TransactionItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool,
  isDeposit: PropTypes.bool
};

function TransactionItem({ item, isLast, isDeposit }) {
  const { commissionRate, commissionValue, ownerUsername, created, currency, currencyFrom, currencyTo, fromNumber, id, innerFrom, innerTo, money, moneyWithCommission, reasonCancel, status, system, toNumber, type } = item;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCommissionMaybe = () => {
    if (!isDeposit && moneyWithCommission != null) {
      return `(${moneyWithCommission})`
    }
    return ''
  }
  return (
    <TimelineItem>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{`Транзакция ${id}`}</DialogTitle>
        <DialogContent>
          <TransactionItemDetail item={item} isDeposit={isDeposit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
      <TimelineOppositeContent>
        <Typography variant="subtitle1">{isDeposit ? "Пополнение" : "Перевод"}</Typography>
        {!isDeposit ? (
          <Typography variant="caption" color="text.secondary">
            {toNumber ? fNumberDeposit(toNumber) : "Вывод средств"}
          </Typography>
        ): (
          <Typography variant="caption" color="text.secondary">
            {ownerUsername}
          </Typography>
        )}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor:
              (status === 'CLOSED' && 'success.main') ||
              (status === 'CANCELED' && 'error.main') ||
              (status === 'HOLD' && 'info.main') ||
              (status === 'WAIT' && 'info.main') ||
              'primary.secondary'
          }}
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{`${isDeposit ? '+' : '-'}${money} ${getCommissionMaybe()} ${fCurrencyByEnum(currency).label}`}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTime(new Date(created))}
        </Typography>
        <Button size="small" sx={{ ml: 1 }} color="secondary" onClick={handleClickOpen}>
          ...
        </Button>
      </TimelineContent>
    </TimelineItem>
  );
}

TransactionList.propTypes = {
  number: PropTypes.string.isRequired,
  refreshState: PropTypes.number,
  refresh: PropTypes.func
}

export default function TransactionList({ refreshState, refresh, number }) {
  const {enqueueSnackbar} = useSnackbar();
  const [transactions, setTransactions] = useState([])
  const [page, setPage] = useState({
    number: 0,
    max: undefined
  })
  useEffect(() => {
    console.log("update")
    loadNewTransactions(0, true)
  }, [refreshState])

  const loadNewTransactions = (pageNumber, withDeletePrev = false) => {
    API_SECURED.get(`${URL_TRANSACTION}api/transaction/account/${number}?page=${pageNumber}&size=5`)
      .then(res => {
        setPage({
          number: pageNumber,
          max: res.data.totalPages
        })
        if (transactions && !withDeletePrev) {
          setTransactions([...transactions, ...res.data.content])
        } else {
          setTransactions([...res.data.content])
        }
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка: ${reason}`, { variant: "error" })
      })
  }

  return (
    <Card>
      <CardHeader title="Операции" />
      <CardContent>
        {transactions.length === 0 ? (
          <Typography variant="body2" color="text.disabled" >
            Нет операций
          </Typography>
        ) : (
          <div>
            <Timeline>
              {transactions.map((item, index) => (
                <TransactionItem
                  key={item.id}
                  item={item}
                  isLast={index === transactions.length - 1 && page.number === page.max - 1}
                  isDeposit={item.fromNumber !== number}/>
              ))}
            </Timeline>
            {page.number !== page.max - 1 && (
              <Button onClick={() => loadNewTransactions(page.number + 1)}>
                Еще...
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

//         sx={{
//           '& .MuiTimelineItem-missingOppositeContent:before': {
//             display: 'none'
//           }
//         }}
