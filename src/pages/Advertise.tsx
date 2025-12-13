import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Modal Component
const Modal = ({ open, title, message, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="mb-6 text-neutral-700">{message}</p>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-neutral-800 text-white rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

const Advertise = () => {
  const { user } = useAuth?.() ?? {};
  const navigate = useNavigate();

  // ===== FORM STATE =====
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [paymentUPI, setPaymentUPI] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [requestedDuration, setRequestedDuration] = useState(7);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [paymentProof, setPaymentProof] = useState(null);
  const fileImagesRef = useRef(null);
  const filePaymentRef = useRef(null);

  // UI
  const [uploading, setUploading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const BASE = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

  // ===== IMAGE HANDLERS =====
  const previewImages = (files) => {
    if (!files) return;
    const arr = Array.from(files);
    setImages(arr);
    setImagePreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  const onImagesChange = (e) => previewImages(e.target.files);

  const onPaymentProofChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return setPaymentProof(null);

    if (!["image/jpeg", "image/png"].includes(f.type)) {
      setErrorMsg("Payment proof must be JPG or PNG only.");
      setErrorModalOpen(true);
      return;
    }
    setPaymentProof(f);
  };

  // ===== VALIDATION =====
  const validate = () => {
    if (!title.trim()) return "Title is required.";
    if (!businessName.trim()) return "Business name is required.";
    if (!description.trim()) return "Description is required.";
    if (!contactPhone.trim()) return "Phone number is required.";
    if (!contactEmail.trim()) return "Email is required.";
    if (images.length === 0) return "Please upload at least one ad image.";
    if (!paymentProof) return "Payment proof is required.";

    return null;
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      setErrorMsg(error);
      setErrorModalOpen(true);
      return;
    }

    setUploading(true);

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("businessName", businessName);
      form.append("contactPhone", contactPhone);
      form.append("contactEmail", contactEmail);
      form.append("paymentUPI", paymentUPI);
      form.append("amountPaid", amountPaid);
      form.append("requestedDuration", requestedDuration);

      images.forEach((img) => form.append("images", img));
      if (paymentProof) form.append("paymentProof", paymentProof);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        user?.token ||
        user?.accessToken;

      const res = await axios.post(`${BASE}/api/ads/create`, form, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });

      if (res.data.success) {
        setSuccessModalOpen(true);

        setTitle("");
        setDescription("");
        setBusinessName("");
        setContactPhone("");
        setContactEmail("");
        setPaymentUPI("");
        setAmountPaid("");
        setRequestedDuration(7);
        setImages([]);
        setImagePreviews([]);
        setPaymentProof(null);

        if (fileImagesRef.current) fileImagesRef.current.value = "";
        if (filePaymentRef.current) filePaymentRef.current.value = "";
      } else {
        setErrorMsg(res.data.message || "Something went wrong.");
        setErrorModalOpen(true);
      }
    } catch (err) {
      console.error("Submit Error =>", err);
      setErrorMsg(err.response?.data?.message || err.message);
      setErrorModalOpen(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Create an Advertisement</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        
        {/* BASIC FIELDS */}
        <div>
          <label className="block mb-1 font-medium">Ad Title *</label>
          <input className="w-full border px-3 py-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 font-medium">Business Name *</label>
          <input className="w-full border px-3 py-2 rounded" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description *</label>
          <textarea className="w-full border px-3 py-2 rounded" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* CONTACT */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Phone *</label>
            <input className="w-full border px-3 py-2 rounded" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email *</label>
            <input className="w-full border px-3 py-2 rounded" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </div>
        </div>

        {/* DURATION */}
        <div>
          <label className="block mb-1 font-medium">Duration (days)</label>
          <select className="w-full border px-3 py-2 rounded" value={requestedDuration} onChange={(e) => setRequestedDuration(Number(e.target.value))}>
            {[3, 7, 10, 14, 21, 30].map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        {/* IMAGES */}
        <div>
          <label className="block mb-1 font-medium">Ad Images *</label>
          <input ref={fileImagesRef} type="file" accept="image/*" multiple onChange={onImagesChange} />
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {imagePreviews.map((src, i) => (
                <img key={i} src={src} className="w-full h-28 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        {/* PAYMENT PROOF */}
        <div>
          <label className="block mb-1 font-medium">Payment Proof (JPG/PNG) *</label>
          <input ref={filePaymentRef} type="file" accept=".jpg,.jpeg,.png" onChange={onPaymentProofChange} />
          {paymentProof && (
            <div className="mt-3 flex items-center gap-3">
              <img src={URL.createObjectURL(paymentProof)} className="w-20 h-16 object-cover rounded" />
              <p className="text-sm">{paymentProof.name}</p>
            </div>
          )}
        </div>

        <button disabled={uploading} className="px-6 py-3 rounded bg-secondary text-white">
          {uploading ? "Uploading..." : "Submit Advertisement"}
        </button>
      </form>

      <Modal open={successModalOpen} title="Success!" message="Advertisement submitted! Pending admin approval." onClose={() => { setSuccessModalOpen(false); navigate("/ads/my"); }} />
      <Modal open={errorModalOpen} title="Error" message={errorMsg} onClose={() => setErrorModalOpen(false)} />
    </div>
  );
};

export default Advertise;
