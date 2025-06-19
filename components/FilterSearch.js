export default function FilterSearch({ onFilter, tujuanList }) {
  const handleFilter = (e) => {
    const { name, value } = e.target;
    onFilter({ [name]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Mulai</label>
        <input
          type="date"
          name="startDate"
          onChange={handleFilter}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Akhir</label>
        <input
          type="date"
          name="endDate"
          onChange={handleFilter}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tujuan Pembayaran</label>
        <select
          name="tujuan"
          onChange={handleFilter}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Semua</option>
          {tujuanList && tujuanList.map((tujuan) => (
            <option key={tujuan} value={tujuan}>{tujuan}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cari</label>
        <input
          type="text"
          name="search"
          placeholder="Cari produk atau customer..."
          onChange={handleFilter}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
  );
} 