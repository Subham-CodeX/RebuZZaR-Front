import { Link } from "react-router-dom";
import RebuZZar from "../assets/RebuZZar.png"; // Logo

// ========================
// CONFIG
// ========================
const ADMIN_WHATSAPP = "916295308500"; // no +, no spaces

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi RebuZZar Team 👋\nI need help regarding the website."
);

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">

          {/* Logo & Tagline */}
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <img src={RebuZZar} alt="RebuZZar Logo" className="h-10 w-auto" />
              <span className="font-bold text-xl text-white">RebuZZar</span>
            </Link>
            <p className="mt-4 text-sm text-neutral-400">
              On-campus marketplace for students to buy and sell educational goods.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-400">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/sell" className="hover:text-white transition-colors">Sell an Item</Link></li>
              <li><Link to="/legal/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-400">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/legal/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal/return-refund-policy" className="hover:text-white transition-colors">Return & Refund Policy</Link></li>
              <li><Link to="/legal/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/legal/advertise-policy" className="hover:text-white transition-colors">Advertise Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-400">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">

              <li className="flex items-start">
                <a
                  href="https://www.google.com/maps?q=22.732388163841886,88.50055494781175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start hover:text-white"
                >
                  <LocationIcon />
                  <span className="ml-3 text-sm">
                    398, Ramkrishnapur Rd, near Jagadighata Market,<br />
                    Barasat, Kolkata, West Bengal 700125
                  </span>
                </a>
              </li>

              <li className="flex items-start">
                <EmailIcon />
                <a
                  href="mailto:rebuzzar@gmail.com"
                  className="ml-3 text-sm hover:text-white"
                >
                  rebuzzar@gmail.com
                </a>
              </li>

              <li className="flex items-start">
                <PhoneIcon />
                <a
                  href="tel:+916295300085"
                  className="ml-3 text-sm hover:text-white"
                >
                  +91 62953 00085
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-400">
              Social Media
            </h3>

            <ul className="mt-4 space-y-3">

              {/* 🔥 WhatsApp Highlighted Button */}
              <li className="flex items-center">
                <WhatsAppIcon />
                <a
                  href={`https://wa.me/${ADMIN_WHATSAPP}?text=${WHATSAPP_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 text-sm font-semibold text-green-400 hover:text-green-300 transition-colors"
                >
                  WhatsApp (Quick Support)
                </a>
              </li>

              <li className="flex items-center">
                <InstagramIcon />
                <a
                  href="https://www.instagram.com/_rebuzzar_/"
                  className="ml-3 text-sm hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>

              <li className="flex items-center">
                <FacebookIcon />
                <a
                  href="https://www.facebook.com/share/1HxqhrLqKV/"
                  className="ml-3 text-sm hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>

              <li className="flex items-center">
                <YouTubeIcon />
                <a
                  href="https://youtube.com/@rebuzzar"
                  className="ml-3 text-sm hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-neutral-700 pt-8 text-center">
          <p className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} RebuZZar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// ========================
// SVG ICONS
// ========================
const LocationIcon = () => (
  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M3 5a2 2 0 012-2h3l2 5-2 2a11 11 0 005 5l2-2 5 2v3a2 2 0 01-2 2C9 21 3 15 3 7z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 32 32">
    <path d="M16 3C9.38 3 4 8.38 4 15c0 2.62.86 5.04 2.32 6.98L4 29l7.2-2.28A11.9 11.9 0 0016 27c6.62 0 12-5.38 12-12S22.62 3 16 3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12a10 10 0 10-11.6 9.9v-7H8v-3h2.4V9.5c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .1 2 .1v2.3h-1.1c-1.1 0-1.4.7-1.4 1.4V12H17l-.5 3h-2.7v7A10 10 0 0022 12z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c2.1.6 9.4.6 9.4.6s7.3 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.8 15V9l6 3-6 3z" />
  </svg>
);

