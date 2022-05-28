import PropTypes from 'prop-types';
// material
import {
  Card,
  Grid,
  CardContent,
  CardHeader,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, Box
} from '@mui/material';
// utils
//
import {useState} from "react";
import {fRoleCompany, fStatusConfirmed, getColorByStatus} from "../../../utils/formatEnum";
import SimpleDataVisible from "../../../components/SimpleDataVisible";
import {fDate} from "../../../utils/formatTime";
import ProfileUpdateForm from "./ProfileUpdateForm";

ProfileCard.propTypes = {
  profile: PropTypes.object.isRequired
};

export default function ProfileCard({ profile }) {
  
  const [open, setOpen] = useState(false)
  
  const handleOnConf = () => {
    setOpen(true)
  }

  return (
    <div>
      <Dialog open={open} fullWidth maxWidth="sm" onClose={() => setOpen(false)} >
        <DialogTitle>Паспортные данные</DialogTitle>
        <DialogContent>
          <Box mt={1} >
            <ProfileUpdateForm profile={profile} />
          </Box>
        </DialogContent>
      </Dialog>
      <Card >
        <CardHeader title="Персональная информация" />
        <CardContent>
          <Stack direction="column" justifyContent="flex-start" >
            <SimpleDataVisible
              label="Имя"
              text={profile.firstName}
              withDivider={false} />
            <SimpleDataVisible
              label="Фамилия"
              text={profile.lastName}
              withDivider={false} />
            <SimpleDataVisible
              label="Отчество"
              text={profile.middleName}
              withDivider={false} />
            <SimpleDataVisible
              label="Email"
              text={profile.email}
              withDivider={false} />
            <SimpleDataVisible
              label="Телефон"
              text={profile.phone}
              withDivider={false} />
            <SimpleDataVisible
              label="Дата рождения"
              text={fDate(new Date(profile.birthday))}
              withDivider={false} />
            <SimpleDataVisible
              label="Паспорт"
              text={profile.passportNumber != null ?`${profile.passportSeries} ${profile.passportNumber}` : ''}
              withDivider={false} />
            {(profile.status !== 'ON_CONFIRMED' && profile.status !== 'CONFIRMED') && (
              <Button
                variant="outlined"
                onClick={handleOnConf}
              >
                Предоставить данные
              </Button>
            )}
            <SimpleDataVisible
              label="Статус профиля"
              text={fStatusConfirmed(profile.status)}
              isLabel
              colorLabel={getColorByStatus(profile.status)}
              withDivider={false} />
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
}
