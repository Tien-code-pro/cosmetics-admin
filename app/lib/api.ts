const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("access_token");
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Chỉ coi là "hết phiên" khi ĐÃ có token mà vẫn bị từ chối.
    // Nếu chưa có token (ví dụ đang gọi /auth/login), 401 chỉ là lỗi sai thông tin đăng nhập bình thường.
    if (token && typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error("Phiên đăng nhập đã hết hạn");
    }

    const error = await res
      .json()
      .catch(() => ({ message: "Sai email hoặc mật khẩu" }));
    throw new Error(error.message || "Sai email hoặc mật khẩu");
  }

  if (res.status === 403) {
    throw new Error("Bạn không có quyền thực hiện thao tác này");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));

    throw new Error(error.message || "Có lỗi xảy ra");
  }

  if (res.status === 204) return null;

  return res.json();
}

export const api = {
  get: (path: string) => request(path),

  post: (path: string, body: any) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: (path: string, body: any) =>
    request(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (path: string) =>
    request(path, {
      method: "DELETE",
    }),
};
