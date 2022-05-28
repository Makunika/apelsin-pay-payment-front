import PropTypes from 'prop-types';
// material
import {Card, Grid, CardContent, CardHeader, Stack} from '@mui/material';
// utils
//
import {fRoleCompany, fStatusConfirmed, getColorByStatus} from "../../../utils/formatEnum";
import SimpleDataVisible from "../../../components/SimpleDataVisible";

CompanyCardDetail.propTypes = {
  companyUser: PropTypes.object.isRequired
};

export default function CompanyCardDetail({ companyUser }) {

  return (
    <Card >
      <CardHeader title="Информация о компании" />
      <CardContent>
        <Stack direction="column" justifyContent="flex-start" >
          <SimpleDataVisible
            label="Название"
            text={companyUser.company.name}
            withDivider={false} />
          <SimpleDataVisible
            label="Роль"
            text={fRoleCompany(companyUser.roleCompany)}
            withDivider={false} />
          <SimpleDataVisible
            label="ИНН"
            text={companyUser.company.inn}
            withDivider={false} />
          <SimpleDataVisible
            label="Адрес"
            text={companyUser.company.address}
            withDivider={false} />
          <SimpleDataVisible
            label="Статус"
            text={fStatusConfirmed(companyUser.company.status)}
            colorTitle={companyUser.company.status === "FAILED_CONFIRMED" ? "error" : "text.disable"}
            isLabel
            colorLabel={getColorByStatus(companyUser.company.status)}
            withDivider={false} />
        </Stack>
      </CardContent>
    </Card>
  );
}
