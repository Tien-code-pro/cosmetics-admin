type Category = {
  id: string;
  name: string;
  slug: string;
  deletedAt?: string | null;
  status: "active" | "inactive"; // thêm dòng này
};
