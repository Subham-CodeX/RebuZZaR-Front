const ADMIN_WHATSAPP = "916295308500";

const message = encodeURIComponent(
  "Hi RebuZZar Team 👋\nI need help."
);

const WhatsAppFloat: React.FC = () => {
  return (
    <a
      href={`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat with RebuZZar on WhatsApp"
    >
      <img
        src="/WhatsApp.png"   // ✅ EXACT public file name
        alt=""                // ✅ prevent text showing if image fails
        className="whatsapp-icon"
        draggable={false}
      />
    </a>
  );
};

export default WhatsAppFloat;
