import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PaymentQRModal from "../components/PaymentQRModal";

const Advertise = () => {
  const navigate = useNavigate();
  const BASE = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

  // ================= FORM STATE =================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [paymentUPI, setPaymentUPI] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [requestedDuration, setRequestedDuration] = useState(7);

  // ================= QR + PAYMENT =================
  const [showQRModal, setShowQRModal] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const paymentRef = useRef<HTMLInputElement | null>(null);

  // ================= IMAGE STATE =================
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);

  // ================= IMAGE HANDLING =================
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > 5) {
      alert("You can upload maximum 5 images.");
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // ================= PAYMENT PROOF =================
  const handlePaymentProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Payment proof must be JPG / PNG / WEBP");
      return;
    }

    setPaymentProof(file);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !businessName || !contactPhone || !contactEmail) {
      return alert("Please fill all required fields.");
    }

    if (images.length === 0) {
      return alert("Upload at least one advertisement image.");
    }

    if (!paymentProof) {
      return alert("Payment proof is required. Please complete payment first.");
    }

    const token =
      localStorage.getItem("token") ??
      localStorage.getItem("authToken");

    if (!token) return alert("Not logged in.");

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("businessName", businessName);
    form.append("contactPhone", contactPhone);
    form.append("contactEmail", contactEmail);
    form.append("paymentUPI", paymentUPI);
    form.append("amountPaid", amountPaid);
    form.append("requestedDuration", String(requestedDuration));

    images.forEach(img => form.append("images", img));
    form.append("paymentProof", paymentProof);

    setLoading(true);
    try {
      await axios.post(`${BASE}/api/ads/create`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Advertisement submitted successfully!");
      navigate("/ads/my");
    } catch (err: any) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Create an Advertisement</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <input className="w-full border px-3 py-2 rounded" placeholder="Ad Title *" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="w-full border px-3 py-2 rounded" placeholder="Business Name *" value={businessName} onChange={e => setBusinessName(e.target.value)} />
        <textarea className="w-full border px-3 py-2 rounded" rows={4} placeholder="Description *" value={description} onChange={e => setDescription(e.target.value)} />

        <div className="grid md:grid-cols-2 gap-4">
          <input className="border px-3 py-2 rounded" placeholder="Phone *" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
          <input className="border px-3 py-2 rounded" placeholder="Email *" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
        </div>

        {/* Hidden but used — keeps backend logic intact */}
        <input type="hidden" value={paymentUPI} onChange={e => setPaymentUPI(e.target.value)} />
        <input type="hidden" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />

        <select
          className="border px-3 py-2 rounded w-full"
          value={requestedDuration}
          onChange={e => setRequestedDuration(Number(e.target.value))}
        >
          {[3, 7, 10, 14, 21, 30].map(d => (
            <option key={d}>{d}</option>
          ))}
        </select>

         {/* ================= IMAGE UPLOAD ================= */}
        <div>
          <label className="font-semibold">Upload Images (up to 5)</label>
          <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={handleImagesChange} />

          {previews.length > 0 && (
            <div className="grid grid-cols-5 gap-3 mt-3">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} className="h-24 w-full object-cover rounded border" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

{/* ================= PAYMENT ================= */}
        <div>
          <label className="font-semibold block mb-1">
            Payment Proof (after QR payment) *
          </label>

          <button
            type="button"
            onClick={() => setShowQRModal(true)}
            className="mb-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Pay via QR Code
          </button>

          <input
            ref={paymentRef}
            type="file"
            accept="image/*"
            onChange={handlePaymentProof}
          />

          {paymentProof && (
            <div className="mt-3 flex items-center gap-3">
              <img
                src={URL.createObjectURL(paymentProof)}
                className="w-24 h-20 object-cover rounded border"
              />
              <span className="text-sm text-green-700 font-semibold">
                Payment proof uploaded
              </span>
            </div>
          )}
        </div>

        <button
          disabled={loading}
          className="w-full py-3 bg-neutral-900 text-white rounded"
        >
          {loading ? "Submitting..." : "Submit Advertisement"}
        </button>
      </form>

      <PaymentQRModal open={showQRModal} onClose={() => setShowQRModal(false)} />
    </div>
  );
};

export default Advertise;
