const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}

function getErrorMessage(data: any, fallback: string) {
  if (!data) {
    return fallback;
  }

  // NestJS ValidationPipe
  // message: ["email must be an email", "password must be ..."]
  if (Array.isArray(data.message)) {
    return data.message.join(", ");
  }

  // Backend chuẩn:
  // { statusCode: 409, message: "Email đã tồn tại..." }
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  // Fallback nếu backend chỉ trả error
  if (typeof data.error === "string" && data.error.trim()) {
    return data.error;
  }

  return fallback;
}

async function parseResponse(res: Response) {
  const contentType = res.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return res.json().catch(() => null);
  }

  return res.text().catch(() => null);
}

async function request<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
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

  // =========================
  // 204 - No Content
  // =========================
  if (res.status === 204) {
    return null as T;
  }

  const data = await parseResponse(res);

  // =========================
  // 401 - Unauthorized
  // =========================
  if (res.status === 401) {
    /*
     * Có token nhưng token không còn hợp lệ
     */
    if (token && typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      window.location.href = "/login";

      throw new ApiError("Phiên đăng nhập đã hết hạn", 401, data);
    }

    /*
     * Không có token
     *
     * Trường hợp phổ biến:
     * POST /auth/login
     * -> Sai email hoặc mật khẩu
     */
    throw new ApiError(
      getErrorMessage(data, "Sai email hoặc mật khẩu"),
      401,
      data,
    );
  }

  // =========================
  // 403 - Forbidden
  // =========================
  if (res.status === 403) {
    throw new ApiError(
      getErrorMessage(data, "Bạn không có quyền thực hiện thao tác này"),
      403,
      data,
    );
  }

  // =========================
  // 400 / 404 / 409 / 422 / 500...
  // =========================
  if (!res.ok) {
    throw new ApiError(
      getErrorMessage(data, "Có lỗi xảy ra. Vui lòng thử lại."),
      res.status,
      data,
    );
  }

  // =========================
  // Success
  // =========================
  return data as T;
}

export const api = {
  get: <T = any>(path: string) =>
    request<T>(path, {
      method: "GET",
    }),

  post: <T = any>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
};
