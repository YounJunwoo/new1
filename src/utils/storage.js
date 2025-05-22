//사용자 계정 정보를 localStorage에 저장하고 불러오는 유틸 함수
export function getLoggedInEmail() {
  return localStorage.getItem('userEmail') || '';
}

export function setLoggedInEmail(email) {
  localStorage.setItem('userEmail', email);
}

export function setFirstName(firstName) {
  localStorage.setItem('firstName', firstName);
}

export function getFirstName() {
  return localStorage.getItem('firstName') || '';
}

export function setLastName(lastName) {
  localStorage.setItem('lastName', lastName);
}

export function getLastName() {
  return localStorage.getItem('lastName') || '';
}

export function setPhoneNumber(phoneNumber) {
  localStorage.setItem('phoneNumber', phoneNumber);
}

export function getPhoneNumber() {
  return localStorage.getItem('phoneNumber') || '';
}

export function setAccountInfo({ email, date, role, id, active }) {
  localStorage.setItem(
    'accountInfo',
    JSON.stringify({ email, date, role, id, active })
  );
}

export function getAccountInfo() {
  return JSON.parse(localStorage.getItem('accountInfo') || '{}');
}
