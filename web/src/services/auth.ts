import api from "./api"

interface Response {
  token: string;
  user: {
    name: string,
    email: string,
  }
}

export function signIn(email: string, password: string): Promise<Response> {
  return new Promise((resolve, reject) => {
    api.post(
      '/authenticate',
      {
        email: email,
        password: password
      }
    ).then(async response => {
      resolve(response.data);
    }
    ).catch(error => {
      reject(error);
    });
  })
}