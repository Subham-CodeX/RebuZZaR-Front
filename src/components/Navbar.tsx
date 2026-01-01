import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Login from "./Login";
import RebuZZar from "../assets/RebuZZar.png";
import Avatar from "../components/Avatar";

const Navbar = ({ setSearch, setMenu }: { setSearch: (value: string) => void; setMenu: (value: string) => void; }) => {
  const [loginPop, setLoginPop] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState("All");
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const categories = ["All", "Books", "Electronics", "Lab Equipment", "Stationery", "Furniture", "Cycle", "Accessories"];

  const handleCategoryClick = (category: string) => {
    const newCategory = category === "All" ? "" : category;
    setActiveCategory(category);
    setMenu(newCategory);
    setMobileMenuOpen(false);
  };

  return (
    <>
    <nav className="bg-white sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* ============================
             DESKTOP NAVBAR
        ============================ */}
        <div className="hidden md:flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <img src={RebuZZar} alt="RebuZZar Logo" className="h-auto w-14 mt-1" />
              <span className="text-xl font-bold text-neutral-800">RebuZZar</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-grow max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="search"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find books, calculators, and more..."
                className="w-full h-10 pl-4 pr-10 border-2 border-neutral-300 rounded-full bg-neutral-100 text-neutral-700"
              />
              <div className="absolute top-0 right-0 h-10 w-10 flex items-center justify-center text-neutral-500">
                <SearchIcon />
              </div>
            </div>
          </div>

          {/* Right Menu */}
          <div className="flex items-center space-x-4">

            {/* Cart Icon */}
            <Link to="/checkout" className="relative p-2 rounded-full hover:bg-neutral-200" title="Cart">
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* ============================
                ADVERTISEMENTS BUTTONS
            ============================ */}
            <Link to="/ads" className="px-3 py-2 text-neutral-700 hover:text-neutral-900 transition">
              Advertisements
            </Link>

            <Link to="/advertise" className="px-3 py-2 bg-secondary text-white rounded hover:opacity-90 transition">
              Upload-Advertise
            </Link>

            {/* ⭐⭐⭐ ADMIN PANEL BUTTON ⭐⭐⭐ */}
            {user?.role === "admin" && (
              <Link to="/admin/ads" className="px-3 py-2 text-blue-600 font-semibold hover:text-blue-800 transition">
                
              </Link>
            )}

            {/* Profile / Login */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-200 transition-all">
                  <Avatar
                      userId={user._id}
                      src={user.avatar}
                      size={40}
                    />
                    
                  <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {/* <ChevronIcon /> */}
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100">
                    Profile
                  </Link>
                  <Link to="/my-bookings" className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100">
                    My Bookings
                  </Link>
                  <Link to="/ads/my" className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100">
                    My Ads
                  </Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-neutral-100">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setLoginPop(!loginPop)} className="flex items-center gap-x-2 font-semibold text-neutral-700">
                Login <UserIcon />
              </button>
            )}
          </div>
        </div>

        {/* ============================
            MOBILE NAVBAR
        ============================ */}
        <div className="md:hidden flex items-center justify-between h-16">

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-neutral-700">
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          {/* Logo */}
          <Link to="/"><img src={RebuZZar} alt="RebuZZar Logo" className="h-14 w-auto" /></Link>

          <div className="flex items-center space-x-3">

            {/* Cart */}
            <Link to="/checkout" className="relative p-2 text-neutral-700">
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                  className="p-1 rounded-full hover:bg-neutral-200 transition-all"
                >
                  <Avatar
                    userId={user._id}
                    src={user.avatar}
                    size={36}
                  />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                    <Link to="/profile" className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100">Profile</Link>
                    <Link to="/my-bookings" className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100">My Bookings</Link>
                    <Link to="/ads/my" className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100">My Ads</Link>
                    {/* ⭐ Mobile Admin Panel
                    {user?.role === "admin" && (
                      <Link to="/admin/ads" >
                      </Link>
                    )} */}

                    <button onClick={logout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-neutral-100">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setLoginPop(!loginPop)} className="font-semibold text-neutral-700">
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <input
            type="search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full h-10 pl-4 pr-10 border-2 border-neutral-300 rounded-full bg-neutral-100"
          />
          <div className="absolute top-0 right-0 h-10 w-10 flex items-center justify-center text-neutral-500">
            <SearchIcon />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-100 shadow-lg">

          {/* NEW - Advertisements Links */}
          <Link to="/ads" className="block px-4 py-3 font-medium text-neutral-700 hover:bg-neutral-200">
            Advertisements
          </Link>

          <Link to="/advertise" className="block px-4 py-3 font-medium bg-secondary text-white">
            Upload-Advertise
          </Link>

          {/* ⭐ Admin Panel in Mobile List 
          {user?.role === "admin" && (
            <Link to="/admin/ads" className="block px-4 py-3 text-blue-600 font-semibold hover:bg-neutral-200">
            </Link>
          )} */}

          <div className="px-4 py-3 border-t border-neutral-300 font-semibold text-neutral-700">
            Categories
          </div>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="w-full text-left px-4 py-2 hover:bg-neutral-200"
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </nav>

    {loginPop && <Login setLoginPop={setLoginPop} />}
    </>
  );
};

// SVG ICONS
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

const UserIcon = () => (
  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-700 text-white">
    <svg className="w-5 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>
  </div>
);


const CartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default Navbar;
