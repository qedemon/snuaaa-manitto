export function getToken() {
  const cookies = document.cookie;
  const cookiesList = cookies?.split("; ");
  const tokenString = cookiesList?.find((val) => val.startsWith("token"));
  if (tokenString) {
    return tokenString?.slice(6);
  } else {
    throw new Error("브라우저에서 토큰을 불러오는 도중 에러가 발생했습니다.");
  }
}

export function setToken(token) {
  document.cookie = `token=${token}`;
}

export function deleteToken() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
