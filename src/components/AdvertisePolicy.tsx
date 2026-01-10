import React from "react";

const AdvertisePolicy: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-center mb-8">
        Advertise Policy
      </h1>

      <h2 className="text-xl font-semibold mb-4 text-center">
        PRIVACY POLICY OF REBUZZAR
      </h2>

      {/* 1. Introduction */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          1. Introduction
        </h3>
        <p>
          This is the Privacy Policies of Advertisements for our Ads Section in
          our platform. Basically, our platform name is <strong>RebuZZar</strong>,
          a primarily student-focused e-commerce platform.
        </p>
        <p className="mt-2">
          The Ads Section is designed for persons or shop owners, PG owners,
          restaurants, shops, and many others who want to grow their business.
          Since this is a student-focused platform, we help advertisers bring
          their businesses directly to students.
        </p>
      </section>

      {/* 2. Advertisement Submission Requirements */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          2. Advertisement Submission Requirements
        </h3>
        <p className="mb-2">
          While uploading an advertisement, advertisers must mandatorily provide:
        </p>
        <ul className="list-decimal ml-6 space-y-1">
          <li>Business Title / Business Name</li>
          <li>Advertisement Title</li>
          <li>Advertisement Images (maximum 5 images allowed)</li>
          <li>Registered Email ID</li>
          <li>Mobile Number</li>
        </ul>
        <p className="mt-2">
          Advertisements submitted with incomplete, misleading, or false
          information may be rejected during verification.
        </p>
      </section>

      {/* 3. Advertisement Duration & Pricing */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          3. Advertisement Duration & Pricing
        </h3>
        <p>
          Advertisers must select the advertisement duration before making
          payment.
        </p>
        <p className="mt-2">Available duration options currently include:</p>
        <ul className="list-disc ml-6 mt-1">
          <li>3 Days</li>
          <li>7 Days</li>
          <li>Additional durations may be introduced later</li>
        </ul>
        <p className="mt-2">
          Advertisement charges are calculated strictly based on the selected
          duration. Pricing is fixed and non-negotiable.
        </p>
      </section>

      {/* 4. Payment Process & Receipt Upload */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          4. Payment Process & Receipt Upload
        </h3>
        <p>
          Advertisers must complete the payment before submitting the
          advertisement. After payment, the advertiser must upload a valid
          payment receipt on the website.
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>If no receipt is uploaded, or</li>
          <li>If a wrong, fake, or unrelated image is uploaded</li>
        </ul>
        <p className="mt-2">
          Then the advertisement will not be published. Submission without valid
          payment proof will be treated as incomplete.
        </p>
      </section>

      {/* 5. Advertisement Visibility & Verification */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          5. Advertisement Visibility & Verification
        </h3>
        <p>After submission:</p>
        <ul className="list-decimal ml-6 mt-2 space-y-1">
          <li>The advertisement will be visible only to the advertiser.</li>
          <li>The advertisement will remain under admin verification.</li>
          <li>
            Once approved by the admin:
            <ul className="list-disc ml-6 mt-1">
              <li>The advertisement becomes publicly visible on the website.</li>
              <li>
                The advertisement may be displayed repeatedly during the active
                duration.
              </li>
            </ul>
          </li>
        </ul>
        <p className="mt-2">
          The platform reserves full rights to approve or reject any
          advertisement.
        </p>
      </section>

      {/* 6. Advertisement Rejection & Refund Policy */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          6. Advertisement Rejection & Refund Policy
        </h3>
        <p>
          If an advertisement is rejected during admin verification:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>The advertiser will be provided with a clear and appropriate reason.</li>
          <li>The full payment will be refunded within 24 hours.</li>
        </ul>
        <p className="mt-2">
          Refunds are applicable only in cases of admin rejection, not after
          approval or once the ad goes live.
        </p>
      </section>

      {/* 7. Advertiser Dashboard */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          7. Advertiser Dashboard & Information Access
        </h3>
        <p>
          Advertisers will have access to a dedicated page where they can view:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Business Name</li>
          <li>Advertisement Title</li>
          <li>Registered Email ID</li>
          <li>Mobile Number</li>
          <li>Uploaded Advertisement Images</li>
          <li>Advertisement Status (Pending / Approved / Rejected)</li>
        </ul>
        <p className="mt-2">
          Advertisers are responsible for ensuring their details remain accurate.
        </p>
      </section>

      {/* 8. Automatic Advertisement Expiry */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          8. Automatic Advertisement Expiry
        </h3>
        <ul className="list-decimal ml-6 space-y-1">
          <li>
            Advertisements will be automatically removed once the selected
            duration ends.
          </li>
          <li>No manual extension or free continuation will be provided.</li>
          <li>
            Advertisers must re-submit and repay to relaunch an advertisement.
          </li>
        </ul>
      </section>

      {/* 9. Renew Policy */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          9. Renew Policy
        </h3>
        <p>
          Advertisers will be provided with access to our website through a QR
          code and official contact details to review advertisement visibility
          and renewal options at any time.
        </p>
        <p className="mt-2">
          Upon successful payment for renewal, the advertisement will be
          activated automatically for the selected duration. Pricing is fixed
          and non-negotiable.
        </p>
      </section>

      {/* 10. Caution */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          10. Caution
        </h3>
        <p>
          As this is a student-focused and university-verified platform, any
          vulgar, offensive, misleading, illegal, or inappropriate content is
          strictly prohibited.
        </p>
        <p className="mt-2">
          Once an advertisement deal is confirmed and payment is completed, the
          advertiser cannot withdraw, cancel, or step back during the active
          advertisement period.
        </p>
        <p className="mt-2">
          The platform reserves the right to remove any advertisement that
          violates this policy without refund.
        </p>
      </section>

      {/* 11. Benefits */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          11. Benefits
        </h3>
        <p>
          RebuZZar is a university-focused platform created and managed by
          students, building trust and familiarity among users.
        </p>
        <p className="mt-2">
          Advertisements are relevant, local, and useful for students, helping
          them discover nearby services, special deals, PGs, hostels, and
          student-friendly offers.
        </p>
      </section>

      {/* 12. Policy Updates */}
      <section>
        <h3 className="text-lg font-semibold mb-2">
          12. Policy Updates
        </h3>
        <p>
          This Advertising Policy may be updated or modified from time to time.
          Continued use of the platform after updates will be considered as
          acceptance of the revised policy.
        </p>
      </section>
    </div>
  );
};

export default AdvertisePolicy;
