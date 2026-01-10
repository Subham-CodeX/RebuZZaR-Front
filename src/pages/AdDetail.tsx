import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import AdImagesSlider from "../components/AdImagesSlider";

type AdDetailResponse = {
  ad: any;
};

const AdDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await api.get<AdDetailResponse>(`/api/ads/${id}`);
        if (res.data?.ad) {
          setAd(res.data.ad);
        } else {
          setAd(null);
        }
      } catch (err) {
        console.error(err);
        setAd(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!ad) return <div className="p-12 text-center">Advertisement not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <AdImagesSlider images={ad.images} title={ad.title} />

      <h1 className="text-3xl font-bold mt-6">{ad.title}</h1>
      <p className="text-neutral-600 mt-2">{ad.description}</p>

      <div className="mt-6 space-y-2 text-sm">
        <p>
          <strong>Business:</strong> {ad.businessName}
        </p>
        <p>
          <strong>Phone:</strong> {ad.contactPhone}
        </p>
        <p>
          <strong>Email:</strong> {ad.contactEmail}
        </p>
      </div>
    </div>
  );
};

export default AdDetail;
