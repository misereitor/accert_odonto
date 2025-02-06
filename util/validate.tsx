export function validatePhone(phone: string) {
  const regex =
    /^\((?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\) (?:[2-8]|9[0-9])[0-9]{3}-[0-9]{4}$/;
  return !regex.test(phone);
}

export function regexPhone(phone: string) {
  if (!phone) return '';
  phone = phone.replace(/\D/g, '');
  phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
  phone = phone.replace(/(\d)(\d{4})$/, '$1-$2');
  return phone;
}
