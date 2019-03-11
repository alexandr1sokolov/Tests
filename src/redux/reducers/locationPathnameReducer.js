export default function locationPathname (state = false, action) {
  switch(action.type) {

    case 'LOCATION_PATHNAME_SAVE':
      return action.payload;

    case 'LOCATION_PATHNAME_CLEAR':
      return false;

    default:
      return state;
  }
}