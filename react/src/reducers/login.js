export default function login(
  state = {
    login_response: {},
    cms_response: {},
    get_cms: {},
    help_data_list: {},
    add_help_response: {},
    edit_help_response: {},
    delete_help_response: {},
    get_referral: {},
    referral_response: {}
  },
  action
) {
  switch (action.type) {
    case "LOGIN_ADMIN_PENDING":
      return { ...state, login_response: {} };
    case "LOGIN_ADMIN_FULFILLED":
      if (action.payload.data.status === 200) {
        localStorage.setItem("jorge_token", action.payload.data.accessToken);
      }
      return { ...state, login_response: action.payload.data };
    case "LOGIN_ADMIN_REJECTED":
      return { ...state, login_response: {} };

    case "GET_CMS_PENDING":
      return { ...state, get_cms: {} };
    case "GET_CMS_FULFILLED":
      return { ...state, get_cms: action.payload.data };
    case "GET_CMS_REJECTED":
      return { ...state, get_cms: {} };

    case "CMS_PENDING":
      return { ...state, cms_response: {} };
    case "CMS_FULFILLED":
      return { ...state, cms_response: action.payload.data };
    case "CMS_REJECTED":
      return { ...state, cms_response: {} };

    case "HELP_DATA_PENDING":
      return { ...state, help_data_list: {} };
    case "HELP_DATA_FULFILLED":
      return { ...state, help_data_list: action.payload.data };
    case "HELP_DATA_REJECTED":
      return { ...state, help_data_list: {} };

    case "ADD_HELP_PENDING":
      return { ...state, add_help_response: {} };
    case "ADD_HELP_FULFILLED":
      return { ...state, add_help_response: action.payload.data };
    case "ADD_HELP_REJECTED":
      return { ...state, add_help_response: {} };

    case "EDIT_HELP_PENDING":
      return { ...state, edit_help_response: {} };
    case "EDIT_HELP_FULFILLED":
      return { ...state, edit_help_response: action.payload.data };
    case "EDIT_HELP_REJECTED":
      return { ...state, edit_help_response: {} };

    case "DELETE_HELP_PENDING":
      return { ...state, delete_help_response: {} };
    case "DELETE_HELP_FULFILLED":
      return { ...state, delete_help_response: action.payload.data };
    case "DELETE_HELP_REJECTED":
      return { ...state, delete_help_response: {} };
    case "GET_REFERRAL_PENDING":
      return { ...state, get_referral: {} };
    case "GET_REFERRAL_FULFILLED":
      return { ...state, get_referral: action.payload.data };
    case "GET_REFERRAL_REJECTED":
      return { ...state, get_referral: {} };

    case "POST_REFERRAL_PENDING":
      return { ...state, referral_response: {} };
    case "POST_REFERRAL_FULFILLED":
      return { ...state, referral_response: action.payload.data };
    case "POST_REFERRAL_REJECTED":
      return { ...state, referral_response: {} };

    case "VERIFY_USER_PENDING":
      return { ...state, verify_response: {} };
    case "VERIFY_USER_FULFILLED":
      return { ...state, verify_response: action.payload.data };
    case "VERIFY_USER_REJECTED":
      return { ...state, verify_response: {} };

    default:
  }
  return state;
}
