const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

interface ApiResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    errors?: Array<{ field: string; message: string }>;
}

class ApiError extends Error {
    statusCode: number;
    errors: Array<{ field: string; message: string }>;

    constructor(response: ApiResponse) {
        super(response.message);
        this.statusCode = response.statusCode;
        this.errors = response.errors || [];
    }
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const json: ApiResponse<T> = await res.json();

    if (!json.success) {
        throw new ApiError(json);
    }

    return json.data;
}

// Auth
export const authApi = {
    signup: (body: {
        loginId: string;
        email: string;
        password: string;
        confirmPassword: string;
    }) =>
        request<null>("/auth/signup", {
            method: "POST",
            body: JSON.stringify(body),
        }),
    login: (body: { loginId: string; password: string }) =>
        request<{ user: User }>("/auth/login", {
            method: "POST",
            body: JSON.stringify(body),
        }),
    logout: () => request<null>("/auth/logout", { method: "POST" }),
    me: () => request<{ user: User }>("/auth/me"),
    pendingUsers: () =>
        request<{ users: PendingUser[] }>("/auth/pending-users"),
    approve: (userId: string) =>
        request<null>(`/auth/approve/${userId}`, { method: "PATCH" }),
    reject: (userId: string) =>
        request<null>(`/auth/reject/${userId}`, { method: "PATCH" }),
    forgotPassword: (body: { email: string }) =>
        request<null>("/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify(body),
        }),

    verifyOtp: (body: { email: string; otp: string }) =>
        request<{ resetToken: string }>("/auth/verify-otp", {
            method: "POST",
            body: JSON.stringify(body),
        }),

    resetPassword: (body: {
        resetToken: string;
        password: string;
        confirmPassword: string;
    }) =>
        request<null>("/auth/reset-password", {
            method: "POST",
            body: JSON.stringify(body),
        }),
};

// Warehouses
export const warehouseApi = {
    list: () => request<{ warehouses: Warehouse[] }>("/warehouses"),
    get: (id: string) => request<{ warehouse: Warehouse }>(`/warehouses/${id}`),
    create: (body: Omit<Warehouse, "_id" | "createdAt" | "updatedAt">) =>
        request<{ warehouse: Warehouse }>("/warehouses", {
            method: "POST",
            body: JSON.stringify(body),
        }),
    update: (
        id: string,
        body: Omit<Warehouse, "_id" | "createdAt" | "updatedAt">,
    ) =>
        request<{ warehouse: Warehouse }>(`/warehouses/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
        }),
    delete: (id: string) =>
        request<null>(`/warehouses/${id}`, { method: "DELETE" }),
};

// Locations
export const locationApi = {
    list: (warehouseId?: string) =>
        request<{ locations: Location[] }>(
            `/locations${warehouseId ? `?warehouse=${warehouseId}` : ""}`,
        ),
    get: (id: string) => request<{ location: Location }>(`/locations/${id}`),
    create: (body: { name: string; shortCode: string; warehouse: string }) =>
        request<{ location: Location }>("/locations", {
            method: "POST",
            body: JSON.stringify(body),
        }),
    update: (
        id: string,
        body: { name: string; shortCode: string; warehouse: string },
    ) =>
        request<{ location: Location }>(`/locations/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
        }),
    delete: (id: string) =>
        request<null>(`/locations/${id}`, { method: "DELETE" }),
};

// Products
export const productApi = {
    list: () => request<{ products: Product[] }>("/products"),
    get: (id: string) => request<{ product: Product }>(`/products/${id}`),
    create: (body: { name: string; skuCode: string; unitCost: number }) =>
        request<{ product: Product }>("/products", {
            method: "POST",
            body: JSON.stringify(body),
        }),
    update: (
        id: string,
        body: { name: string; skuCode: string; unitCost: number },
    ) =>
        request<{ product: Product }>(`/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
        }),
    updateStock: (id: string, onHand: number) =>
        request<{ product: Product }>(`/products/${id}/stock`, {
            method: "PATCH",
            body: JSON.stringify({ onHand }),
        }),
    delete: (id: string) =>
        request<null>(`/products/${id}`, { method: "DELETE" }),
};

// Operations
export const operationApi = {
    list: (params?: { type?: string; status?: string; search?: string }) => {
        const query = new URLSearchParams();
        if (params?.type) query.set("type", params.type);
        if (params?.status) query.set("status", params.status);
        if (params?.search) query.set("search", params.search);
        const qs = query.toString();
        return request<{ operations: Operation[] }>(
            `/operations${qs ? `?${qs}` : ""}`,
        );
    },
    get: (id: string) =>
        request<{ operation: Operation; lines: OperationLine[] }>(
            `/operations/${id}`,
        ),
    create: (body: CreateOperationBody) =>
        request<{ operation: Operation; lines: OperationLine[] }>(
            "/operations",
            { method: "POST", body: JSON.stringify(body) },
        ),
    update: (id: string, body: UpdateOperationBody) =>
        request<{ operation: Operation; lines: OperationLine[] }>(
            `/operations/${id}`,
            { method: "PUT", body: JSON.stringify(body) },
        ),
    todo: (id: string) =>
        request<{ operation: Operation; lines: OperationLine[] }>(
            `/operations/${id}/todo`,
            { method: "PATCH" },
        ),
    validate: (id: string) =>
        request<{ operation: Operation; lines: OperationLine[] }>(
            `/operations/${id}/validate`,
            { method: "PATCH" },
        ),
    cancel: (id: string) =>
        request<{ operation: Operation }>(`/operations/${id}/cancel`, {
            method: "PATCH",
        }),
};

// Move History
export const moveHistoryApi = {
    list: (params?: { type?: string; search?: string }) => {
        const query = new URLSearchParams();
        if (params?.type) query.set("type", params.type);
        if (params?.search) query.set("search", params.search);
        const qs = query.toString();
        return request<{ history: MoveHistory[] }>(
            `/move-history${qs ? `?${qs}` : ""}`,
        );
    },
    getLedger: (productId: string) =>
    request<{ ledger: LedgerEntry[] }>(`/move-history/product/${productId}`),
};


export const transferApi = {
  list: (params?: { search?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    return request<{ operations: Operation[] }>(`/transfers${qs ? `?${qs}` : ""}`);
  },
  create: (body: TransferBody) =>
    request<{
      outOperation: { operation: Operation; lines: OperationLine[] };
      inOperation:  { operation: Operation; lines: OperationLine[] };
    }>("/transfers", { method: "POST", body: JSON.stringify(body) }),
};

// Dashboard
export const dashboardApi = {
    get: () => request<DashboardData>("/dashboard"),
};

export { ApiError };

// Types
export interface User {
    _id: string;
    loginId: string;
    email: string;
    role: "admin" | "user";
}

export interface PendingUser {
    _id: string;
    loginId: string;
    email: string;
    createdAt: string;
}

export interface Warehouse {
    _id: string;
    name: string;
    shortCode: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}

export interface Location {
    _id: string;
    name: string;
    shortCode: string;
    fullCode: string;
    warehouse: { _id: string; name: string; shortCode: string };
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    _id: string;
    name: string;
    skuCode: string;
    unitCost: number;
    onHand: number;
    freeToUse: number;
    createdAt: string;
    updatedAt: string;
}

export interface Operation {
    _id: string;
    reference: string;
    type: "IN" | "OUT";
    contact: string;
    scheduleDate: string;
    status: "draft" | "ready" | "waiting" | "done" | "cancelled";
    deliveryAddress: string;
    responsible: { _id: string; loginId: string; email: string };
    warehouse: { _id: string; name: string; shortCode: string };
    createdAt: string;
    updatedAt: string;
}

export interface OperationLine {
    _id: string;
    operation: string;
    product: {
        _id: string;
        name: string;
        skuCode: string;
        unitCost: number;
        onHand: number;
    };
    quantity: number;
    isShort: boolean;
}

export interface CreateOperationBody {
    type: "IN" | "OUT";
    contact: string;
    scheduleDate: string;
    warehouse: string;
    deliveryAddress?: string;
    lines: Array<{ product: string; quantity: number }>;
}

export interface UpdateOperationBody {
    contact?: string;
    scheduleDate?: string;
    deliveryAddress?: string;
    lines?: Array<{ product: string; quantity: number }>;
}

export interface MoveHistory {
    _id: string;
    moveType: "IN" | "OUT";
    quantity: number;
    movedAt: string;
    operation: { _id: string; reference: string; contact: string };
    product: { _id: string; name: string };
    fromLocation: { _id: string; fullCode: string };
    toLocation: { _id: string; fullCode: string };
}

export interface DashboardData {
    receipts: { total: number; late: number; operations: number };
    deliveries: {
        total: number;
        late: number;
        waiting: number;
        operations: number;
    };
}

export interface TransferBody {
  fromWarehouse: string;
  toWarehouse: string;
  scheduleDate: string;
  lines: Array<{ product: string; quantity: number }>;
}

export interface LedgerEntry {
  _id: string;
  moveType: "IN" | "OUT";
  quantity: number;
  balance: number;
  movedAt: string;
  operation: { _id: string; reference: string; contact: string };
  fromLocation?: { _id: string; fullCode: string };
  toLocation?:   { _id: string; fullCode: string };
}