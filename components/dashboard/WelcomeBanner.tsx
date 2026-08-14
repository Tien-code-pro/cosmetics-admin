export default function WelcomeBanner() {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-7 text-white shadow-lg shadow-blue-600/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-blue-100">SHOP ADMIN</p>

          <h2 className="text-2xl font-bold">
            Chào mừng đến với hệ thống quản trị 👋
          </h2>

          <p className="mt-2 max-w-xl text-sm text-blue-100">
            Quản lý sản phẩm, danh mục, khách hàng và đơn hàng của cửa hàng tại
            một nơi.
          </p>
        </div>

        <div className="hidden text-[80px] opacity-20 md:block">🛍️</div>
      </div>
    </div>
  );
}
