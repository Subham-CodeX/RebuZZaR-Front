import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

const CreateAd = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    businessName: "",
    contactPhone: "",
    contactEmail: "",
    paymentUPI: "",
    amountPaid: "",
    requestedDuration: "7",
  });

  const [images, setImages] = useState<File[]>([]);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Add images (max 5)
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert("You can upload maximum 5 images");
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const submitAd = async () => {
    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    if (!token) return alert("You are not logged in");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach(img => fd.append("images", img));
    if (paymentProof) fd.append("paymentProof", paymentProof);

    setLoading(true);
    try {
      await axios.post(`${API}/api/ads/create`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Advertisement submitted successfully!");
      setImages([]);
      setPaymentProof(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Advertisement</h1>

      <div className="space-y-4">
        <input name="title" onChange={handleChange} placeholder="Title" className="w-full p-3 border rounded" />
        <textarea name="description" onChange={handleChange} placeholder="Description" className="w-full p-3 border rounded" />
        <input name="businessName" onChange={handleChange} placeholder="Business Name" className="w-full p-3 border rounded" />
        <input name="contactPhone" onChange={handleChange} placeholder="Phone" className="w-full p-3 border rounded" />
        <input name="contactEmail" onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded" />
        <input name="paymentUPI" onChange={handleChange} placeholder="UPI ID" className="w-full p-3 border rounded" />
        <input name="amountPaid" onChange={handleChange} placeholder="Amount Paid" className="w-full p-3 border rounded" />
        <input name="requestedDuration" type="number" onChange={handleChange} placeholder="Duration (days)" className="w-full p-3 border rounded" />

        {/* Upload images */}
        <input type="file" multiple accept="image/*" onChange={handleImagesChange} />

        {/* Image previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-5 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  className="h-24 w-full object-cover rounded border"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Payment proof */}
        <label className="font-semibold block">Upload Payment Proof</label>
        <input type="file" accept="image/*" onChange={e => setPaymentProof(e.target.files?.[0] || null)} />

        <button
          onClick={submitAd}
          disabled={loading}
          className="w-full py-3 bg-neutral-900 text-white rounded"
        >
          {loading ? "Submitting..." : "Submit Advertisement"}
        </button>
      </div>
    </div>
  );
};

export default CreateAd;
