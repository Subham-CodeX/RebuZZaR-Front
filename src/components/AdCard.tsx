// src/components/AdCard.tsx
import React from "react";

type Ad = {
  _id: string;
  title: string;
  description: string;
  images?: string[];
  businessName?: string;
  contactPhone?: string;
  contactEmail?: string;
  paymentUPI?: string;
  amountPaid?: number;
  status?: string; // pending | approved | rejected | expired
  approvedAt?: string;
  expiresAt?: string;
  ownerId?: any;
};

const AdCard: React.FC<{ ad: Ad; showContact?: boolean }> = ({ ad, showContact = false }) => {
  const images = Array.isArray(ad.images) && ad.images.length ? ad.images : ["/placeholder-ad.png"];
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="h-44 bg-gray-100 overflow-hidden">
        <img src={images[0]} alt={ad.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{ad.title}</h3>
        <p className="text-sm text-neutral-600 mt-1 line-clamp-3">{ad.description}</p>

        <div className="mt-3 text-sm text-neutral-500">
          <div><strong>Business:</strong> {ad.businessName}</div>
          <div><strong>Status:</strong> <span className="capitalize">{ad.status}</span></div>
          {ad.approvedAt && <div><strong>Approved:</strong> {new Date(ad.approvedAt).toLocaleDateString()}</div>}
        </div>

        {showContact && (
          <div className="mt-3">
            <div className="text-sm"><strong>Phone:</strong> {ad.contactPhone}</div>
            <div className="text-sm"><strong>Email:</strong> {ad.contactEmail}</div>
            <div className="text-sm"><strong>UPI:</strong> {ad.paymentUPI}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdCard;
