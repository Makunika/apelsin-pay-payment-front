import PropTypes from 'prop-types';
// material
import {Card, Grid, CardContent, CardHeader, Stack, Button, Typography} from '@mui/material';
// utils
//
import {LoadingButton} from "@mui/lab";
import {useState} from "react";
import {useSnackbar} from "notistack";
import SimpleDataVisible from "../../../components/SimpleDataVisible";
import apiSecured, {URL_INFO_BUSINESS} from "../../../api/ApiSecured";
import {isConfirmed, isOwner} from "../../../utils/companyUtils";

CompanyCardApiKey.propTypes = {
  companyUser: PropTypes.object.isRequired
};

export default function CompanyCardApiKey({ companyUser }) {
  const [isLoading, setLoading] = useState(false)
  const [isShowing, setShowing] = useState(false)
  const [apiKey, setApiKey] = useState('***************')
  const {enqueueSnackbar} = useSnackbar();

  const showApiKey = () => {
    setLoading(true)
    apiSecured.get(`${URL_INFO_BUSINESS}company/${companyUser.company.id}/api/key`)
      .then(res => {
        setApiKey(res.data)
        setShowing(true)
        setLoading(false)
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка: ${reason}`, {variant: "error"})
      })
  }

  const regenerateApiKey = () => {
    apiSecured.post(`${URL_INFO_BUSINESS}company/${companyUser.company.id}/api/regenerate/key`)
      .then(res => {
        setApiKey('***************')
        setShowing(false)
        setLoading(false)
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка: ${reason}`, {variant: "error"})
      })
  }

  return (
    <Card >
      <CardHeader title="API" />
      <CardContent>
        {!isConfirmed(companyUser) && (
          <Typography color="text.disable" >
            Необходимо подтверждение компании
          </Typography>
        )}
        {isConfirmed(companyUser) && (
          <Stack direction="column" justifyContent="flex-start" spacing={2}>
            <SimpleDataVisible
              label="API ключ"
              text={apiKey}
              withDivider={false} />

            {!isShowing && (
              <LoadingButton
                variant="contained"
                onClick={showApiKey}
                loading={isLoading}
              >
                Показать API ключ
              </LoadingButton>
            )}
            {isShowing && (
              <Button
                variant="contained"
                onClick={() => {
                  setApiKey('***************')
                  setShowing(false)
                }}
              >
                Скрыть
              </Button>
            )}
            {isOwner(companyUser) && (
              <LoadingButton
                onClick={regenerateApiKey}
                loading={isLoading}
              >
                Перегенерировать API ключ
              </LoadingButton>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
