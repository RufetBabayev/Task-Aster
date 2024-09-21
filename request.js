import { apiNews } from "./api.js";
import { getStorage, setStorage } from "./helper.js";

const baseUrl = "https://all-api.bitcode.az/api/";

export const getCategories = async () => {
  try {
    const res = await fetch(baseUrl + apiNews.newsCategory);
    const data = await res.json();
    return data;
  } catch (error) {}
};
export const getNews = async () => {
  try {
    const res = await fetch(baseUrl + apiNews.allNews + "?limit=7");
    const data = await res.json();
    return data;
  } catch (error) {}
};
export const getNewsBySlug = async (slug) => {
  try {
    const res = await fetch(baseUrl + apiNews.getBySlug + slug);
    const data = await res.json();
    return data;
  } catch (error) {}
};

export const loginTo = async (data) => {
  try {
    const res = await fetch(baseUrl + apiNews.login, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      setStorage("token", data.token);
      setStorage("userid", data.user.id);
      return data;
    } else if (res.status === 422) {
      return await res.json();
    }
  } catch (error) {}
};

export const getComments = async (id) => {
  const replaceId = apiNews.commentByNews.replace(":id", id);
  const res = await fetch(baseUrl + replaceId);
  const data = await res.json();
  return data;
};
export const postComments = async (id, comment) => {
  const token = getStorage("token");
  const replaceId = apiNews.commentByNews.replace(":id", id);
  const res = await fetch(baseUrl + replaceId, {
    method: "POST",
    body: JSON.stringify(comment),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data;
};
