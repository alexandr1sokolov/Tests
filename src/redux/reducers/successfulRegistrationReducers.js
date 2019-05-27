export default function successfulRegistration(state = false, action) {
  switch (action.type) {
    case "SUCCESSFUL_REGISTRATION":
      return true;
    case "CLEAR_SUCCESSFUL_REGISTRATION":
      return false;
    default:
      return state;
  }
}
