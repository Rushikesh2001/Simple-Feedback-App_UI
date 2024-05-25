const getOneDayBeforeDate = () => {
  const date = new Date();
  date?.setDate(date.getDate() - 1);
  return date;
};

export class Cookie {
  static getCookies(key) {
    const cookies = document.cookie;
    const arr = cookies.split(";");
    for (let cookie of arr) {
      var [name, value] = cookie.split("=");
      name = name.trim();
      value = value.trim();
      if (name === key) {
        return value;
      }
    }
    return "";
  }

  static setCookies(key, value) {
    document.cookie = `${key}=${value}`;
  }

  static deleteCookie(key) {
    if (typeof window === "undefined") return;
    document.cookie = `${key}=;expires=${getOneDayBeforeDate()}`;
  }
}
