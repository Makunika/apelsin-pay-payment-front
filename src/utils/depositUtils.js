import {fCurrencyByEnum} from "./formatEnum";

export const fillTypeDataPersonal = (value) => {
  const typeData = [
    {
      description: "Валюта",
      value: fCurrencyByEnum(value.currency).valueStr
    },
    {
      description: "Максимальная сумма на счете",
      value: `${value.maxSum} ${fCurrencyByEnum(value.currency).label}`
    },
    {
      description: "Максимальная сумма для перевода",
      value: `${value.maxSumForPay} ${fCurrencyByEnum(value.currency).label}`
    },
  ]

  if (value.minSumToStartWork != null) {
    typeData.push({
      description: "Минимальная сумма для активации счета",
      value: `${value.minSumToStartWork} ${fCurrencyByEnum(value.currency).label}`
    })
  }

  typeData.push({
    description: "Необходимость подтверждения профиля",
    value: value.typeRequiredConfirmed ? "Да" : "Нет"
  })

  return typeData
}

export const fillTypeDataBusiness = (value) => [
    {
      description: "Валюта",
      value: fCurrencyByEnum(value.currency).valueStr
    },
    {
      description: "Максимальная сумма для вывода средств за раз",
      value: value.maxSumForTransfer != null ?
        `${value.maxSumForTransfer} ${fCurrencyByEnum(value.currency).label}`
        :
        "Нет"
    },
    {
      description: "Комиссия за вывод средств",
      value: value.commissionRateWithdraw != null ?
        `${value.commissionRateWithdraw * 100} %`
        :
        "Нет"
    },
  ]