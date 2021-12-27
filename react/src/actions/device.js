import { API_URL, axiosConfig } from "../config";
import axios from "axios";
export function platformList(params) {
  return {
    type: `PLATFORM_LIST`,
    payload: axios.get(`${API_URL}/platform`, axiosConfig)
  };
}
export function brandList(params) {
  return {
    type: `BRAND_LIST`,
    payload: axios.get(`${API_URL}/brand?platformId=${params}`, axiosConfig)
  };
}

export function issueList(params) {
  return {
    type: `ISSUE_LIST`,
    payload: axios.get(`${API_URL}/issue?modelId=${params}`, axiosConfig)
  };
}
export function modelList(params) {
  return {
    type: `MODEL_LIST`,
    payload: axios.get(`${API_URL}/model?brandId=${params.brandId}&&platformId=${params.platformId}&&ty=${params.ty}`, axiosConfig)
  };
}

export function addEditPlatform(params, method) {
  if (method === "add") {
    return {
      type: `ADD_PLATFORM`,
      payload: axios.post(`${API_URL}/platform`, params, axiosConfig)
    };
  } else if (method === "edit") {
    return {
      type: `EDIT_PLATFORM`,
      payload: axios.put(`${API_URL}/platform`, params, axiosConfig)
    };
  }
}

export function deletePlatform(params) {
  return {
    type: `DELETE_PLATFORM`,
    payload: axios.delete(`${API_URL}/platform?id=${params.id}`, axiosConfig)
  };
}

export function addEditBrand(params, method) {
  if (method === "add") {
    return {
      type: `ADD_BRAND`,
      payload: axios.post(`${API_URL}/brand`, params, axiosConfig)
    };
  } else if (method === "edit") {
    return {
      type: `EDIT_BRAND`,
      payload: axios.put(`${API_URL}/brand`, params, axiosConfig)
    };
  }
}


export function addEditIssue(params, method) {
  if (method === "add") {
    return {
      type: `ADD_ISSUE`,
      payload: axios.post(`${API_URL}/issue`, params, axiosConfig)
    };
  } else if (method === "edit") {
    return {
      type: `EDIT_ISSUE`,
      payload: axios.put(`${API_URL}/issue`, params, axiosConfig)
    };
  }
}

export function deleteIssue(params) {
  return {
    type: `DELETE_ISSUE`,
    payload: axios.delete(`${API_URL}/issue?modelId=${params.modelId}`, axiosConfig)
  };
}

export function deleteBrand(params) {
  return {
    type: `DELETE_BRAND`,
    payload: axios.delete(`${API_URL}/brand?id=${params.id}`, axiosConfig)
  };
}


export function getModel(params) {
  return {
    type: `GET_MODEL`,
    payload: axios.get(`${API_URL}/model?brandId=${params}`, axiosConfig)
  };
}
export function addEditModel(params, method) {
  if (method === "add") {
    return {
      type: `ADD_MODEL`,
      payload: axios.post(`${API_URL}/model`, params, axiosConfig)
    };
  } else if (method === "edit") {
    return {
      type: `EDIT_MODEL`,
      payload: axios.put(`${API_URL}/model`, params, axiosConfig)
    };
  }
}

export function addAvailableAreaImage(params) {
    return {
      type: `ADD_AVAILABLE_IMAGE`,
      payload: axios.post(`${API_URL}/cms/availableAreaImage`, params, axiosConfig)
    };
}

export function deleteAvailableAreaImage(params) {
  return {
    type: `DELETE_AVAILABLE_IMAGE`,
    payload: axios.post(`${API_URL}/cms/deleteAreaImage`, params, axiosConfig)
  };
}

export function addDiscountCode(params) {
  return {
    type: `ADD_DISCOUNT_CODE`,
    payload: axios.post(`${API_URL}/referal/addDiscount`, params, axiosConfig)
  };
}

export function updateDiscountCode(params) {
  return {
    type: `UPDATE_DISCOUNT_CODE`,
    payload: axios.post(`${API_URL}/referal/updateDiscount`, params, axiosConfig)
  };
}

export function deleteCode(params) {
  return {
    type: `DELETE_DISCOUNT_CODE`,
    payload: axios.post(`${API_URL}/referal/deleteDiscount`, params, axiosConfig)
  };
}

export function updateStatus(params) {
  return {
    type: `UPDATE_STATUS`,
    payload: axios.post(`${API_URL}/referal/udpateStatus`, params, axiosConfig)
  };
}

export function deleteModel(params) {
  return {
    type: `DELETE_MODEL`,
    payload: axios.delete(`${API_URL}/model?id=${params.id}`, axiosConfig)
  };
}

export function searchModelApi(params) {
  return {
    type: `MODEL_LIST`,
    payload: axios.get(`${API_URL}cms/search_model?q=${params}`, axiosConfig)
  };
}