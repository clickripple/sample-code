import { API_URL, axiosConfig } from "../config";
import axios from "axios";
export function loginAdmin(params) {
  return {
    type: `LOGIN_ADMIN`,
    payload: axios.post(API_URL + "/admin/login", params)
  };
}

export function getCMS(params) {
  return {
    type: `GET_CMS`,
    payload: axios.get(API_URL + "/cms/get_privacy_terms")
  };
}

export function CMS(params, flag) {
  if (flag === "add") {
    return {
      type: `CMS`,
      payload: axios.post(API_URL + "/cms", params)
    };
  } else if (flag === "edit") {
    return {
      type: `CMS`,
      payload: axios.put(API_URL + "/cms", params)
    };
  }
}

export function helpDataList(params) {
  return {
    type: `HELP_DATA`,
    payload: axios.get(`${API_URL}/help?brandId=${params}`, axiosConfig)
  };
}

export function addEditHelpData(params, flag) {
  if (flag === "add") {
    return {
      type: `ADD_HELP`,
      payload: axios.post(API_URL + "/help", params, axiosConfig)
    };
  } else if (flag === "edit") {
    return {
      type: `EDIT_HELP`,
      payload: axios.put(API_URL + "/help", params, axiosConfig)
    };
  }
}

export function deleteHelpData(params) {
  return { 
    type: `DELETE_HELP`,
    payload: axios.delete(
      `${API_URL}/help?brandId=${params.brandId}`,
      axiosConfig
    )
  };
}

export function getReferral() {
  return {
    type: `GET_REFERRAL`,
    payload: axios.get(API_URL + "/referal")
  };
}

export function updatePromo(params) {
  return {
    type: `UPDATE_PROMO`,
    payload: axios.post(API_URL + "/referal/udpatePromo", params)
  };
}

export function postReferral(params) {
  return {
    type: `POST_REFERRAL`,
    payload: axios.put(API_URL + "/referal", params)
  };
}

export function verifyUser(params) {
  return {
    type: `VERIFY_USER`,
    payload: axios.get(`${API_URL}/user/email-verify`,  {
      headers: {
        token: params
      }})
  };
}
