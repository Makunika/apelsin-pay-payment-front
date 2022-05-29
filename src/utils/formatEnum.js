export const currencies = [
  {
    value: 'USD',
    label: '$',
    valueStr: 'Доллар'
  },
  {
    value: 'EUR',
    label: '€',
    valueStr: 'Евро'
  },
  {
    value: 'RUB',
    label: '₽',
    valueStr: 'Рубль'
  }
];

export function fCurrencyByEnum(enumStr) {
  return currencies.find(value => value.value === enumStr);
}

export function fStatusConfirmed(status) {
  if (status === "CONFIRMED") {
    return "Подтвержден"
  }
  if (status === "NOT_CONFIRMED") {
    return "Не подтвержден"
  }
  if (status === "FAILED_CONFIRMED") {
    return "Данные не подтвердились"
  }
  if (status === "ON_CONFIRMED") {
    return "На подтверждении"
  }
  return status
}