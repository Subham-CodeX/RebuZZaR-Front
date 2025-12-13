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

  const submitAd = async () => {
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  if (!token) {
    alert("You are not logged in.");
    return;
  }

  const fd = new FormData();

  Object.entries(form).forEach(([key, value]) => fd.append(key, value));
  images.forEach((img) => fd.append("images", img));
  if (paymentProof) fd.append("paymentProof", paymentProof);

  setLoading(true);

  try {
    await axios.post(`${API}/api/ads/create`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Advertisement submitted successfully!");
  } catch (err) {
    alert("Error submitting advertisement");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-neutral-800 mb-6">
        Create Your Advertisement
      </h1>

      <div className="space-y-4">
        <input
          name="title"
          onChange={handleChange}
          placeholder="Advertisement Title"
          className="w-full p-3 border rounded"
        />

        <textarea
          name="description"
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3 border rounded"
        />

        <input
          name="businessName"
          onChange={handleChange}
          placeholder="Business / Shop Name"
          className="w-full p-3 border rounded"
        />

        <input
          name="contactPhone"
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full p-3 border rounded"
        />

        <input
          name="contactEmail"
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full p-3 border rounded"
        />

        <input
          name="paymentUPI"
          onChange={handleChange}
          placeholder="Your UPI ID"
          className="w-full p-3 border rounded"
        />

        <input
          name="amountPaid"
          onChange={handleChange}
          placeholder="Amount Paid"
          className="w-full p-3 border rounded"
        />

        <input
          name="requestedDuration"
          type="number"
          onChange={handleChange}
          placeholder="Duration (days)"
          className="w-full p-3 border rounded"
        />

        <input
          type="file"
          multiple
          onChange={(e) =>
            setImages(Array.from(e.target.files || []))
          }
          className="w-full"
        />

        <input
          type="file"
          onChange={(e) =>
            setPaymentProof(e.target.files?.[0] || null)
          }
          className="w-full"
        />

        <button
          onClick={submitAd}
          className="w-full py-3 bg-neutral-900 text-white rounded hover:bg-neutral-700"
        >
          {loading ? "Submitting..." : "Submit Advertisement"}
        </button>
      </div>
    </div>
  );
};

export default CreateAd;
