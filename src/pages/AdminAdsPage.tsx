import { useEffect, useState } from "react";
import api from "../lib/api";
import { withAuthHeaders } from "../lib/api";
import AdImagesSlider from "../components/AdImagesSlider";

const AdminAdsPage = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token") ?? undefined;

  const fetchPendingAds = async () => {
    try {
      const res = await api.get("/api/admin/ads/pending", withAuthHeaders(token));
      setAds(res.data.ads || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAds();
  }, []);

  const approveAd = async (id: string) => {
    if (!confirm("Approve this advertisement?")) return;
    try {
      await api.post(`/api/admin/ads/approve/${id}`, {}, withAuthHeaders(token));
      alert("Advertisement Approved!");
      fetchPendingAds();
    } catch (err) {
      console.error(err);
      alert("Error approving ad.");
    }
  };

  const rejectAd = async (id: string) => {
    if (!confirm("Reject this advertisement?")) return;
    try {
      await api.post(`/api/admin/ads/reject/${id}`, { reason: "Not suitable" }, withAuthHeaders(token));
      alert("Advertisement Rejected!");
      fetchPendingAds();
    } catch (err) {
      console.error(err);
      alert("Error rejecting ad.");
    }
  };

  if (loading) return <div className="p-10">Loading pending advertisements…</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Pending Advertisements</h1>

      {ads.length === 0 ? (
        <p className="text-neutral-500">No pending advertisements.</p>
      ) : (
        <div className="space-y-6">
          {ads.map((ad) => (
            <div key={ad._id} className="p-5 border rounded-lg shadow">
              <h2 className="text-xl font-bold">{ad.title}</h2>
              <p className="text-neutral-700">{ad.description}</p>

              <div className="mt-3">
                <strong>Business:</strong> {ad.businessName} <br />
                <strong>Email:</strong> {ad.contactEmail} <br />
                <strong>Phone:</strong> {ad.contactPhone}
              </div>

              <div className="mt-4">
                <AdImagesSlider images={ad.images} title={ad.title} />
              </div>

              <div className="mt-3">
                <strong>Payment Proof:</strong>
                {ad.paymentProof ? (
                  <img src={ad.paymentProof} className="mt-2 w-32 h-20 object-cover rounded" />
                ) : (
                  "No proof uploaded"
                )}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => approveAd(ad._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectAd(ad._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAdsPage;
