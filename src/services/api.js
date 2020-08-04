import AsyncStorage from '@react-native-community/async-storage';
import { constants } from "@config"
const API_URL = 'https://personal.qala.az/api';
const LANG = "az";
const HIDDEN_TOKEN = "s4925dXPsqnN3xkotbKK33greSCAQA6I";


const getToken = async () => {
  const userString = await AsyncStorage.getItem(constants.asyncKeys.user);
  const user = await JSON.parse(userString);

  return user.token;
}

const authFin = (fin, password) => {
  let params = new FormData();
  params.append('fin_code', fin);
  params.append('password', password);

  return fetch(API_URL + '/auth/fin/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: params,
  }).then(response => response.json());
};

const authAsan = (user_id, phone) => {
  let params = new FormData();
  params.append('lang', LANG);
  params.append('user_id', user_id);
  params.append('phone', phone);

  return fetch(API_URL + '/auth/asan/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: params,
  }).then(response => response.json());
};

const calculateLifeClassic = async (sex, birthday, insurer_start_date, contract_length, amount, warranty) => {
  let token = await getToken();

  let params = new FormData();
  params.append('sex', sex);
  params.append('birthday', birthday);
  params.append('insurer_start_date', insurer_start_date);
  params.append('contract_length', contract_length);
  params.append('amount', amount);
  params.append('warranty', warranty);

  return fetch(API_URL + '/calculate/insurance/lifeclassic/', {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
    body: params,
  }).then(response => response.json());
};

const calculateHarmless = async (calculator_type, sex, birthday, insurance_start_date, amount, percent) => {
  let token = await getToken();

  let params = new FormData();
  params.append('calculator_type', calculator_type);
  params.append('sex', sex);
  params.append('birthday', birthday);
  params.append('insurance_start_date', insurance_start_date);
  params.append('amount', amount);
  params.append('percent', percent);


  console.log(params);

  return fetch(API_URL + '/calculate/insurance/harmless/', {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
    body: params,
  }).then(response => response.json());
};


const requestInsurance = async (insurance, fields) => {
  let token = await getToken();

  let params = new FormData();

  for (let key in fields) {
    if (fields[key] === Object(fields[key])) {
      params.append(key, fields[key].label)
    } else {
      params.append(key, fields[key]);
    }
  }

  console.log(params)

  return fetch(API_URL + '/request/insurance/' + insurance, {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
    body: params,
  }).then(response => response.json());
};

const calculateFuture = async (birthday, contract_length, work_type, dsmf, gross, death_month_length, life_month_length) => {
  let token = await getToken();


  let params = new FormData();
  params.append('birthday', birthday);
  params.append('contract_length', contract_length);
  params.append('work_type', work_type);
  params.append('dsmf', dsmf);
  params.append('gross', gross);
  params.append('death_month_length', death_month_length);
  params.append('life_month_length', life_month_length);

  console.log(params)

  return fetch(API_URL + '/calculate/insurance/future/', {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
    body: params,
  }).then(response => response.json());
};

const calculateCapital = async (work_type, sex, age, contract_length, is_usd, gross) => {
  let token = await getToken();

  let params = new FormData();
  params.append('work_type', work_type);
  params.append('sex', sex);
  params.append('age', age);
  params.append('contract_length', contract_length);
  params.append('is_usd', is_usd);
  params.append('gross', gross);

  console.log(params);

  return fetch(API_URL + '/calculate/insurance/capital/', {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
    body: params,
  }).then(response => response.json());
};


const asanValidate = (transaction_id, is_connect = false) => {
  let params = new FormData();
  params.append('lang', LANG);
  params.append('transaction_id', transaction_id);
  if (is_connect) {
    params.append("is_connect", true);
  }

  return fetch(API_URL + '/validate/asan/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: params,
  }).then(response => response.json());
};

const getUser = async () => {
  let token = await getToken();

  return fetch(API_URL + '/user', {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
};



const getContracts = async () => {

  let token = await getToken();
  console.log("getContracts", token);

  return fetch(API_URL + '/contracts', {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
};



const updatePassword = async (current_password, new_password) => {
  const token = await getToken();

  const formData = new URLSearchParams();
  formData.append('current_password', current_password);
  formData.append('new_password', new_password);

  return fetch(API_URL + '/user/password', {
    method: 'PUT',
    headers: {
      Authorization: token,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  }).then(response => response.json());
};

const getContractByFin = async (policyNumber, fin) => {

  return fetch(API_URL + '/contract?policy_number=' + policyNumber + '&fin_code=' + fin, {
    method: 'GET',
    headers: {
      Authorization: HIDDEN_TOKEN,
      Accept: 'application/json',
    },
  }).then(response => response.json());
};


const getContractByVOEN = async (policyNumber, voen) => {

  return fetch(API_URL + '/contract/voen?policy_number=' + policyNumber + '&voen=' + voen, {
    method: 'GET',
    headers: {
      Authorization: HIDDEN_TOKEN,
      Accept: 'application/json',
    },
  }).then(response => response.json());
};






const getISBPage = async (
  vehicle_plate,
  vehicle_cert,
  id_card,
  pin_code,
  phone_number,
) => {
  let token = await AsyncStorage.getItem('USER_TOKEN');

  let query =
    'vehicle_plate=' +
    vehicle_plate +
    '&vehicle_cert=' +
    vehicle_cert +
    '&id_card=' +
    id_card +
    '&pin_code=' +
    pin_code +
    '&phone_number=' +
    phone_number;
  return fetch(API_URL + '/isb' + '?' + query, {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
    },
  }).then(response => response.json());
};

export default {
  authFin,
  authAsan,
  asanValidate,
  getContracts,
  getUser,
  updatePassword,
  calculateCapital,
  calculateFuture,
  calculateHarmless,
  calculateLifeClassic,
  requestInsurance,
  getContractByFin,
  getContractByVOEN
};
