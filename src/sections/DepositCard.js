import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {Card, Typography, CardContent, CardHeader} from '@mui/material';
import SimpleDataVisible from "../components/SimpleDataVisible";
import {fNumberDeposit} from "../utils/formatNumber";
import {fCurrencyByEnum} from "../utils/formatEnum";

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
}));

DepositCard.propTypes = {
  deposit: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default function DepositCard({ deposit, onClick }) {
  const { balance, currency, lock, number, typeId, typeName, userId, validType } = deposit

  return (
    <Card
    onClick={() => onClick(deposit)}
    sx={{
      cursor: 'pointer'
    }}
    >
      <CardHeader title={typeName} titleTypographyProps={{ variant: 'body1' }} />
      <CardContent>
        <SimpleDataVisible label="Номер счета" text={fNumberDeposit(number)} />
        <InfoStyle>
          <Typography style={{ fontWeight: 600 }} >{`${balance} ${fCurrencyByEnum(currency).label}`}</Typography>
        </InfoStyle>
      </CardContent>
    </Card>
  );
}
