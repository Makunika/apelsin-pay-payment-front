
export function fNumberDeposit(number) {
  const str = number.toString();

  return `${str.substring(0, 5)} ${str.substring(5, 10)} ${str.substring(10, 15)} ${str.substring(15, 20)}`
}
