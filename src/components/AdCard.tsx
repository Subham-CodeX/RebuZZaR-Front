import { useNavigate } from "react-router-dom";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  approved: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
  expired: "bg-gray-200 text-gray-700 border-gray-400",
};

const AdCard = ({ ad, showContact = false }: any) => {
  const navigate = useNavigate();
  const image = ad.images?.[0] || "/placeholder-ad.png";

  return (
    <div
      onClick={() => navigate(`/ads/${ad._id}`)}
      className="cursor-pointer border rounded-lg bg-white shadow hover:shadow-lg transition"
    >
      {/* IMAGE */}
      <img
        src={image}
        alt={ad.title}
        className="h-44 w-full object-cover rounded-t-lg"
      />

      <div className="p-4 text-left space-y-2">
        {/* TITLE + STATUS */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-lg line-clamp-1">{ad.title}</h3>

          {ad.status && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded border ${
                STATUS_STYLES[ad.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {ad.status.toUpperCase()}
            </span>
          )}
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-neutral-600 line-clamp-2">
          {ad.description}
        </p>

        {/* CONTACT (OPTIONAL) */}
        {showContact && (
          <div className="pt-2 text-sm space-y-1">
            <p><strong>Phone:</strong> {ad.contactPhone}</p>
            <p><strong>Email:</strong> {ad.contactEmail}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdCard;
