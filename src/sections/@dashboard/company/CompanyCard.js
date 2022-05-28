import PropTypes from 'prop-types';
import {Link as RouterLink} from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import {Link, Card, Grid, CardContent, Stack} from '@mui/material';
// utils
import SimpleDataVisible from "../../../components/SimpleDataVisible";
import {fRoleCompany, fStatusConfirmed} from "../../../utils/formatEnum";
//

// ----------------------------------------------------------------------

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});
// ----------------------------------------------------------------------

CompanyCard.propTypes = {
  company: PropTypes.object.isRequired,
  index: PropTypes.number
};

export default function CompanyCard({ company, index }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card>
        <CardContent>
          <TitleStyle
            to={`/dashboard/company?${company.company.id}`}
            color="inherit"
            variant="subtitle2"
            underline="hover"
            component={RouterLink}
          >
            {company.company.name}
          </TitleStyle>
          <Stack direction="column" justifyContent="flex-start" >
            <SimpleDataVisible
              label="Роль"
              text={fRoleCompany(company.roleCompany)}
              withDivider={false} />
            <SimpleDataVisible
              label="ИНН" text={company.company.inn}
              withDivider={false} />
            <SimpleDataVisible
              label="Статус"
              text={fStatusConfirmed(company.company.status)}
              colorTitle={company.company.status === "FAILED_CONFIRMED" ? "text.error" : "text.disable"}
              withDivider={false} />
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}
