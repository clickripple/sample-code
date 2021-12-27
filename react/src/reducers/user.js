export default function user(
  state = {
    person_list: {},
    person_data: {},
    block_response: {},
    user_help_data: {},
    status_response: {},
    technician_payment_response: {},
    technician_payment: {},
    booking_data: {},
    pincodes: {},
    reports: {},
    add_pincode:{},
    add_response: {},
    payment_history: {},
    newsletter: [],
    add_news_response: {},
    edit_news_response: {},
    delete_news_response: {},
    problems: [],
    supports: [],
    documents: []
  },
  action
) {
  switch (action.type) {
    
    
    case "NEWSLETTER_FULFILLED": {
        return { ...state, newsletter: action.payload.data };
    }
    case "PROBLEMS_DATA_FULFILLED": {
      return { ...state, problems: action.payload.data };
    }
    case "GET_TECH_DATA_FULFILLED": {
      return { ...state, supports: action.payload.data };
    }
  
    case "ADD_NEWSLETTER_FULFILLED":
      return { ...state, add_news_response : action.payload.data };

    case "EDIT_NEWSLETTER_FULFILLED":
      return { ...state, edit_news_response : action.payload.data };

    case "DELETE_NEWSLETTER_FULFILLED": {
      return { ...state, delete_news_response : action.payload.data };
    }
  
    case "PERSON_LIST_PENDING":
      return { ...state, person_list: {} };
    case "PERSON_LIST_FULFILLED":
      return { ...state, person_list: action.payload.data };
    case "PERSON_LIST_REJECTED":
      return { ...state, person_list: {} };

    case "GET_PERSON_PENDING":
      return { ...state, person_data: {} };
    case "GET_PERSON_FULFILLED":
      return { ...state, person_data: action.payload.data };
    case "GET_PERSON_REJECTED":
      return { ...state, person_data: {} };

    case "BLOCK_PERSON_PENDING":
      return { ...state, block_response: {} };
    case "BLOCK_PERSON_FULFILLED":
      return { ...state, block_response: action.payload.data };
    case "BLOCK_PERSON_REJECTED":
      return { ...state, block_response: {} };

    case "ADD_EDIT_PERSON_PENDING":
      return { ...state, add_response: {} };
    case "ADD_EDIT_PERSON_FULFILLED":
      return { ...state, add_response: action.payload.data };
    case "ADD_EDIT_PERSON_REJECTED":
      return { ...state, add_response: {} };

    case "USER_HELP_DATA_PENDING":
      return { ...state, user_help_data: {} };
    case "USER_HELP_DATA_FULFILLED":
      return { ...state, user_help_data: action.payload.data };
    case "USER_HELP_DATA_REJECTED":
      return { ...state, user_help_data: {} };

    case "HELP_STATUS_PENDING":
      return { ...state, status_response: {} };
    case "HELP_STATUS_FULFILLED":
      return { ...state, status_response: action.payload.data };
    case "HELP_STATUS_REJECTED":
      return { ...state, status_response: {} };

    case "TECHNICIAN_PAYMENT_DATA_PENDING":
      return { ...state, technician_payment_response: {} };
    case "TECHNICIAN_PAYMENT_DATA_FULFILLED":
      return { ...state, technician_payment_response: action.payload.data };
    case "TECHNICIAN_PAYMENT_DATA_REJECTED":
      return { ...state, technician_payment_response: {} };

    case "TECHNICIAN_PAYMENT_PENDING":
      return { ...state, technician_payment: {} };
    case "TECHNICIAN_PAYMENT_FULFILLED":
      return { ...state, technician_payment: action.payload.data };
    case "TECHNICIAN_PAYMENT_REJECTED":
      return { ...state, technician_payment: {} };

      case "PAYMENT_HISTORY_PENDING":
        return { ...state, payment_history: {} };
      case "PAYMENT_HISTORY_FULFILLED":
        return { ...state, payment_history: action.payload.data };
      case "PAYMENT_HISTORY_REJECTED":
        return { ...state, payment_history: {} };

    case "BOOKINGS_PENDING":
      return { ...state, booking_data: {} };
    case "BOOKINGS_FULFILLED":
      return { ...state, booking_data: action.payload.data };
    case "BOOKINGS_REJECTED":
      return { ...state, booking_data: {} };

    case "CODES":
      return { ...state, pincodes: action.payload.data };
    case "REPORTS":
      return { ...state, reports: action.payload.data };
    case "ADD_CODES":
      return { ...state, add_pincode: action.payload.data };
    case "BLOCK_CODE":
      return { ...state, pincode: action.payload.data };
      
    
    default: 
  }
  return state;
}
