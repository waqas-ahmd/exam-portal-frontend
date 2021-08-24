export const baseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return "https://agile-taiga-63754.herokuapp.com";
  } else {
    return "http://192.168.100.21:5000";
  }
};
