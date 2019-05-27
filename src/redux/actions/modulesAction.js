import axios from "axios";

export function fetchModulesData(data) {
  return {
    type: "ALL_MODULES",
    payload: data
  };
}

function fetchModules() {
  return axios
    .get("https://student-tests.goit.co.ua/api/modules")
    .then(result => (result.status === 200 ? result.data : null))
    .catch(err => console.log(err));
}

export const fetchModulesDataAsync = () => dispatch => {
  fetchModules()
    .then(modules => dispatch(fetchModulesData(modules)))
    .catch(err => console.log(err));
};
