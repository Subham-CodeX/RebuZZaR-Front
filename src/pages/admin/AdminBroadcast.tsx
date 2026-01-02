import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_BACKEND_URL;

export default function AdminBroadcast() {
  const { token, user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500 text-lg">🚫 Access denied</p>
      </div>
    );
  }

  const sendAnnouncement = async () => {
    if (!subject.trim() || !message.trim()) {
      alert("Subject and message are required");
      return;
    }

    try {
      setLoading(true);
      await fetch(`${API}/api/admin/email/broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, message }),
      });

      alert("📢 Announcement sent successfully!");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("Broadcast failed", err);
      alert("Failed to send announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-gray-50 flex justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            📢 Send Announcement
          </h1>
          <p className="text-gray-500 mt-1">
            Send an important message to all registered users via email.
          </p>
        </div>

        {/* Subject */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Subject
          </label>
          <input
            type="text"
            placeholder="e.g. Important Notice for All Students"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            placeholder="Write your announcement message here..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={sendAnnouncement}
            disabled={loading}
            className={`px-6 py-2.5 rounded-lg font-medium text-white
              ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
              } transition`}
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 mt-6">
          ⚠️ This email will be sent to all verified users. Use responsibly.
        </p>
      </div>
    </div>
  );
}
