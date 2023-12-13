// Log the dimensions
const useScreenWH = () => {
  const screenWidth = window.innerWidth;
  //320 480 600 >600
  //320
  if (screenWidth < 400) {
    return 2;
  }
  if (screenWidth >= 400 && screenWidth < 480) {
    return 3;
  }
  if (screenWidth >= 480 && screenWidth < 600) {
    return 4;
  }
  if (screenWidth >= 600) {
    return 9;
  }
};
export default useScreenWH;
