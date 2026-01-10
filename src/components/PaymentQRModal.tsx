import React from "react";
import qrImage from "../assets/Advertise-qr.jpeg"; // ✅ FIXED ADMIN QR

interface PaymentQRModalProps {
  open: boolean;
  onClose: () => void;
}

const PaymentQRModal: React.FC<PaymentQRModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative bg-white rounded-lg p-6 w-full max-w-sm text-center">

        {/* ❌ Cancel button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
          aria-label="Close payment popup"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-3">Pay for Advertisement</h2>

        <img
          src={qrImage}
          alt="Advertisement Payment QR"
          className="mx-auto w-56 h-56 object-contain border rounded"
        />

        <p className="text-sm text-neutral-600 mt-3">
          Scan this QR code and complete the payment.
          <br />
          After payment, upload the screenshot as proof.
        </p>

        <button
          onClick={onClose}
          className="mt-5 px-5 py-2 bg-neutral-900 text-white rounded"
        >
          I have paid
        </button>
      </div>
    </div>
  );
};


export default PaymentQRModal;
