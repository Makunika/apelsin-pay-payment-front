import PropTypes from 'prop-types';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import {Box, Link, Card, Grid, Avatar, Typography, CardContent, Stack, TextField} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import {fNumberDeposit, fShortenNumber} from '../../../utils/formatNumber';
//
import SvgIconStyle from '../../../components/SvgIconStyle';
import Iconify from '../../../components/Iconify';
import {fCurrencyByEnum} from "../../../utils/formatEnum";
import SimpleDataVisible from "../../../components/SimpleDataVisible";

// ----------------------------------------------------------------------

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
}));

DepositCard.propTypes = {
  deposit: PropTypes.object.isRequired,
  index: PropTypes.number
};

export default function DepositCard({ deposit, index }) {
  const { balance, currency, lock, number, typeId, typeName, userId, validType } = deposit

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card>
        <CardContent>
          <TitleStyle
            to={`/dashboard/deposit?${number}`}
            color="inherit"
            variant="subtitle2"
            underline="hover"
            component={RouterLink}
          >
            {typeName}
          </TitleStyle>
          <SimpleDataVisible label="Номер счета" text={fNumberDeposit(number)} />
          {lock && <Typography color="warning">Счет заблокирован</Typography>}
          <InfoStyle>
            <Typography style={{ fontWeight: 600 }} >{`${balance} ${fCurrencyByEnum(currency).label}`}</Typography>
          </InfoStyle>
        </CardContent>
      </Card>
    </Grid>
  );
}
