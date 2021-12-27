export default function device(
  state = {
    platform_list: {},
    brand_list: {},
    issue_list: {},
    model_list: {},
    edit_response: {},
    delete_response: {},
    add_response: {},
    get_model: {}
  },
  action
) {
  switch (action.type) {
    case "PLATFORM_LIST_PENDING":
      return { ...state, platform_list: {} };
    case "PLATFORM_LIST_FULFILLED":
      return { ...state, platform_list: action.payload.data };
    case "PLATFORM_LIST_REJECTED":
      return { ...state, platform_list: {} };

    case "BRAND_LIST_PENDING":
      return { ...state, brand_list: {} };
    case "BRAND_LIST_FULFILLED":
      return { ...state, brand_list: action.payload.data };
    case "BRAND_LIST_REJECTED":
      return { ...state, brand_list: {} };

    case "ISSUE_LIST_PENDING":
      return { ...state, issue_list: {} };
    case "ISSUE_LIST_FULFILLED":
      return { ...state, issue_list: action.payload.data };
    case "ISSUE_LIST_REJECTED":
      return { ...state, issue_list: {} };

    case "MODEL_LIST_PENDING":
      return { ...state, model_list: {} };
    case "MODEL_LIST_FULFILLED":
      return { ...state, model_list: action.payload.data };
    case "MODEL_LIST_REJECTED":
      return { ...state, model_list: {} };

    case "ADD_PLATFORM_PENDING":
      return { ...state, add_response: {} };
    case "ADD_PLATFORM_FULFILLED":
      return { ...state, add_response: action.payload.data };
    case "ADD_PLATFORM_REJECTED":
      return { ...state, add_response: {} };

    case "EDIT_PLATFORM_PENDING":
      return { ...state, edit_response: {} };
    case "EDIT_PLATFORM_FULFILLED":
      return { ...state, edit_response: action.payload.data };
    case "EDIT_PLATFORM_REJECTED":
      return { ...state, edit_response: {} };

    case "DELETE_PLATFORM_PENDING":
      return { ...state, delete_response: {} };
    case "DELETE_PLATFORM_FULFILLED":
      return { ...state, delete_response: action.payload.data };
    case "DELETE_PLATFORM_REJECTED":
      return { ...state, delete_response: {} };

    case "ADD_BRAND_PENDING":
      return { ...state, add_response: {} };
    case "ADD_BRAND_FULFILLED":
      return { ...state, add_response: action.payload.data };
    case "ADD_BRAND_REJECTED":
      return { ...state, add_response: {} };

    case "EDIT_BRAND_PENDING":
      return { ...state, edit_response: {} };
    case "EDIT_BRAND_FULFILLED":
      return { ...state, edit_response: action.payload.data };
    case "EDIT_BRAND_REJECTED":
      return { ...state, edit_response: {} };

    case "ADD_ISSUE_PENDING":
      return { ...state, add_response: {} };
    case "ADD_ISSUE_FULFILLED":
      return { ...state, add_response: action.payload.data };
    case "ADD_ISSUE_REJECTED":
      return { ...state, add_response: {} };

    case "EDIT_ISSUE_PENDING":
      return { ...state, edit_response: {} };
    case "EDIT_ISSUE_FULFILLED":
      return { ...state, edit_response: action.payload.data };
    case "EDIT_ISSUE_REJECTED":
      return { ...state, edit_response: {} };

      case "DELETE_ISSUE_PENDING":
        return { ...state, delete_response: {} };
      case "DELETE_ISSUE_FULFILLED":
        return { ...state, delete_response: action.payload.data };
      case "DELETE_ISSUE_REJECTED":
        return { ...state, delete_response: {} };

    case "DELETE_BRAND_PENDING":
      return { ...state, delete_response: {} };
    case "DELETE_BRAND_FULFILLED":
      return { ...state, delete_response: action.payload.data };
    case "DELETE_BRAND_REJECTED":
      return { ...state, delete_response: {} };

    case "GET_MODEL_PENDING":
      return { ...state, get_model: {} };
    case "GET_MODEL_FULFILLED":
      return { ...state, get_model: action.payload.data };
    case "GET_MODEL_REJECTED":
      return { ...state, get_model: {} };

    case "ADD_MODEL_PENDING":
      return { ...state, add_response: {} };
    case "ADD_MODEL_FULFILLED":
      return { ...state, add_response: action.payload.data };
    case "ADD_MODEL_REJECTED":
      return { ...state, add_response: {} };

    case "EDIT_MODEL_PENDING":
      return { ...state, edit_response: {} };
    case "EDIT_MODEL_FULFILLED":
      return { ...state, edit_response: action.payload.data };
    case "EDIT_MODEL_REJECTED":
      return { ...state, edit_response: {} };

    case "DELETE_MODEL_PENDING":
      return { ...state, delete_response: {} };
    case "DELETE_MODEL_FULFILLED":
      return { ...state, delete_response: action.payload.data };
    case "DELETE_MODEL_REJECTED":
      return { ...state, delete_response: {} };
    default:
  }
  return state;
}
