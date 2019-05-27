import axios from "axios";

const TOKEN = () => localStorage.getItem("token");

function parseJWT() {
  if (TOKEN()) {
    let base64 = TOKEN().split(".")[1];
    return JSON.parse(window.atob(base64));
  } else {
    return false;
  }
}

export function checkUser() {
  let auth = parseJWT();
  const AuthStr = "Bearer ".concat(TOKEN());

  return (
    TOKEN() !== null &&
    axios
      .get(`https://student-tests.goit.co.ua/api/users/${auth.id}`, {
        headers: { Authorization: AuthStr }
      })
      .then(result => result.status)
      .catch(err => console.log(err))
  );
}

export function getUserAuthHeader() {
  const AuthStr = "Bearer ".concat(TOKEN());
  return { headers: { Authorization: AuthStr } };
}

export function getUserId() {
  let auth = parseJWT();
  return !auth ? false : auth.id;
}
