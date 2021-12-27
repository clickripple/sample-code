export const API_URL = process.env.REACT_APP_URL + "/api";
export const MOBILE_API_URL = process.env.REACT_APP_URL + "/mobile/api";
export const IMG_PATH = process.env.REACT_APP_URL + "/";

export const cryptr_key =
  "";
const token = localStorage.getItem("jorge_token");
let axios_config = {};
if (token && token !== undefined && token !== null && token !== "null") {
  axios_config = {
    headers: {
      Authorization: "Token" + token
    }
  };
}
export const axiosConfig = axios_config;

export const awsConfig = {
  bucketName: '',
  dirName: '', /* optional */
  region: '',
  accessKeyId: '',
  secretAccessKey: '',
  s3Url: '', /* optional */
}
