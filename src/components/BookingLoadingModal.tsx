const BookingLoadingModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl p-8 text-center w-80">
        <div className="text-4xl mb-3">🛒⏳</div>

        <h2 className="text-lg font-semibold text-gray-800">
          Placing your booking…
        </h2>

        <p className="text-sm text-gray-600 mt-2">
          Please wait, we are confirming your order
        </p>

        <div className="mt-6 flex justify-center">
          <div className="h-8 w-8 border-4 border-neutral-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default BookingLoadingModal;
