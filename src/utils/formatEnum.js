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

export const BUSINESS_TYPE = "business_type";
export const PERSONAL_TYPE = "personal_type";

export function fCurrencyByEnum(enumStr) {
  return currencies.find(value => value.value === enumStr);
}

export function fStatusTransaction(status) {
  if (status === 'CLOSED') {
    return 'Завершена'
  }
  if (status === 'CANCELED') {
    return 'Отменена'
  }
  if (status === 'CREATED') {
    return 'Создана'
  }
  if (status === 'WAIT') {
    return "Ожидает оплату от Тинькофф"
  }
  return status
}

export function fTypeTransaction(type) {
  if (type === 'TRANSFER') {
    return 'Перевод'
  }
  if (type === 'PAYMENT') {
    return 'Оплата'
  }
  return type
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

export function fRoleCompany(role) {
  if (role === "OWNER") {
    return "Владелец"
  }
  if (role === "MODERATOR") {
    return "Участник"
  }
  return role
}

export function getColorByStatus(status) {
  if (status === "CONFIRMED") {
    return "success"
  }
  if (status === "NOT_CONFIRMED") {
    return "warning"
  }
  if (status === "FAILED_CONFIRMED") {
    return "error"
  }
  if (status === "ON_CONFIRMED") {
    return "warning"
  }
  return 'primary'
}