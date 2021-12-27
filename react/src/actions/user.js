import { API_URL, axiosConfig, MOBILE_API_URL } from "../config";
import axios from "axios";

export function personList(params) {
  if (params === "user") {
    return {
      type: `PERSON_LIST`,
      payload: axios.get(`${API_URL}/user/user`, axiosConfig)
    };
  } else {
    return {
      type: `PERSON_LIST`,
      payload: axios.get(`${API_URL}/user/technician`, axiosConfig)
    };
  }
}
export function viewPerson(params) {
  if (params.role === "user") {
    return {
      type: `GET_PERSON`,
      payload: axios.get(
        `${API_URL}/user/details?id=${params.id}`,
        axiosConfig
      )
    };
  } else {
    return {
      type: `GET_PERSON`,
      payload: axios.get(
        `${API_URL}/user/tec_details?id=${params.id}`,
        axiosConfig
      )
    };
  }
}
export function blockPerson(params, role) {
  if (role === "user") {
    return {
      type: `BLOCK_PERSON`,
      payload: axios.put(`${API_URL}/user/updateStatus`, params, axiosConfig)
    };
  } else {
    return {
      type: `BLOCK_PERSON`,
      payload: axios.put(`${API_URL}/user/technician`, params, axiosConfig)
    };
  }
}

export function deletePerson(params, role) {
  if (role === "user") {
    return {
      type: `DELETE_PERSON`,
      payload: axios.put(`${API_URL}/user/updateStatus`, params, axiosConfig)
    };
  } else {
    return {
      type: `DELETE_PERSON`,
      payload: axios.post(`${API_URL}/technician/delete`, params, axiosConfig)
    };
  }
}

export function addPerson(params, role) {
  if (role === "user") {
    return {
      type: `ADD_EDIT_PERSON`,
      payload: axios.post(`${API_URL}/user`, params, axiosConfig)
    };
  } else {
    return {
      type: `ADD_EDIT_PERSON`,
      payload: axios.post(`${API_URL}/technician`, params, axiosConfig)
    };
  }
}

export function editPerson(params, role) {
  console.log('role',role)
  if (role === "user") {
    return {
      type: `ADD_EDIT_PERSON`,
      payload: axios.put(`${API_URL}/user`, params, axiosConfig)
    };
  } else {
    return {
      type: `ADD_EDIT_PERSON`,
      payload: axios.put(`${API_URL}/technician`, params, axiosConfig)
    };
  }
}


export function userHelpData(params) {
  return {
    type: `USER_HELP_DATA`,
    payload: axios.get(`${API_URL}/support`, axiosConfig)
  };
}

export function getProblems() {
  return {
    type: `PROBLEMS_DATA`,
    payload: axios.get(`${API_URL}/referal/problems`, axiosConfig)
  };
}

export function addProblem(parms) {
  return {
    type: `ADD_PROBLEMS_DATA`,
    payload: axios.post(`${API_URL}/referal/problem/create`, parms, axiosConfig)
  };
}

export function updateProblem(parms) {
  return {
    type: `UPDATE_PROBLEMS_DATA`,
    payload: axios.post(`${API_URL}/referal/problem/update`, parms, axiosConfig)
  };
}

export function deleteProb(parms) {
  return {
    type: `DELETE_PROBLEMS_DATA`,
    payload: axios.post(`${API_URL}/referal/problem/delete`, parms, axiosConfig)
  };
}

export function getTechSupport() {
  return {
    type: `GET_TECH_DATA`,
    payload: axios.get(`${API_URL}/referal/tech_supports`, axiosConfig)
  };
}

export function helpStatus(params) {
  return {
    type: `HELP_STATUS`,
    payload: axios.put(`${API_URL}/support`, params, axiosConfig)
  };
}

export function technicianPaymentList() {
  return {
    type: `TECHNICIAN_PAYMENT_DATA`,
    payload: axios.get(`${API_URL}/cms/payment_history`, axiosConfig)
  };
}

export function technicianPaymentData(params, flag) {
  return {
    type: `TECHNICIAN_PAYMENT`,
    payload: axios.post(API_URL + "/cms/paid_technician", params)
  };
}

export function viewPaymentHistory(params, flag) {
  return {
    type: `PAYMENT_HISTORY`,
    payload: axios.post(API_URL + "/cms/paid_ian", params)
  };
}

export function bookings(params, flag) {
  return {
    type: `BOOKINGS`,
    payload: axios.get(`${API_URL}/cms/booking`, params)
  };
}

export function codes(params, flag) {
  return {
    type: `CODES`,
    payload: axios.get(`${API_URL}/admin/pincodes`, params)
  };
}

export function reports(params, flag) {
  return {
    type: `REPORTS`,
    payload: axios.get(`${API_URL}/admin/reports`, params)
  };
}

export function showReport(params, flag) {
  return {
    type: `SINGLE_REPORT`,
    payload: axios.post(`${API_URL}/admin/single_report`, params)
  };
}

export function uploadDocument(params, flag) {
  return {
    type: `UPLOAD_DOC`,
    payload: axios.post(`${MOBILE_API_URL}/technician/upload_document`, params)
  };
}

export function docStatus(params, flag) {
  return {
    type: `DOC_STATUS`,
    payload: axios.post(`${API_URL}/admin/doc_status`, params)
  };
}


export function add_codes(params, flag) {
  return {
    type: `ADD_CODES`,
    payload: axios.post(`${API_URL}/admin/pincode`, params)
  };
}

export function block_code(params, flag) {
  return {
    type: `BLOCK_CODE`,
    payload: axios.delete(`${API_URL}/admin/pincode`, params)
  };
}


//search api's
export function searchApi(params) {
  if (params.role === "user") {
    return {
      type: `PERSON_LIST`,
      payload: axios.get(`${API_URL}/user/user_search?q=${params.query}`, axiosConfig)
    };
  } else {
    return {
      type: `PERSON_LIST`,
      payload: axios.get(`${API_URL}/user/tech_search?q=${params.query}`, axiosConfig)
    };
  }
}

export function helpSearchApi(params) {
  return {
    type: `USER_HELP_DATA`,
    payload: axios.get(`${API_URL}/support/user_search?q=${params}`, axiosConfig)
  };
}

export function searchBookingApi(params) {
  return {
    type: `BOOKINGS`,
    payload: axios.get(`${API_URL}/cms/search_booking?q=${params}`, axiosConfig)
  };
}

export function searchPaymentApi(params) {
  return {
    type: `TECHNICIAN_PAYMENT_DATA`,
    payload: axios.get(`${API_URL}/cms/payment_search?q=${params}`, axiosConfig)
  };
}

export function getNewsletter() {

  return {
    type: `NEWSLETTER`,
    payload: axios.get(`${API_URL}/cms/newsletter`, axiosConfig)
  };
}

export function addNews(data) {

  return {
    type: `ADD_NEWSLETTER`,
    payload: axios.post(`${API_URL}/cms/add-news`, data, axiosConfig)
  };
}

export function editNews(data) {

  return {
    type: `EDIT_NEWSLETTER`,
    payload: axios.post(`${API_URL}/cms/edit-news`, data, axiosConfig)
  };
}

export function deleteNews(data) {
  return {
    type: `DELETE_NEWSLETTER`,
    payload: axios.post(`${API_URL}/cms/delete-news`, data, axiosConfig)
  };
}