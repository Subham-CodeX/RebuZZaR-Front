import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const Sell = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { user, token } = useAuth();
    const navigate = useNavigate();

    // Generate image previews
    useEffect(() => {
        if (images.length === 0) {
            setPreviews([]);
            return;
        }
        const objectUrls = images.map(file => URL.createObjectURL(file));
        setPreviews(objectUrls);
        return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
    }, [images]);

    // New function to handle removing a specific image
    const handleRemoveImage = (indexToRemove: number) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleImageSelect = (files: FileList | null) => {
        if (!files) return;

        const selectedFiles = Array.from(files).filter(
            file =>
                !images.some(
                    img => img.name === file.name && img.size === file.size
                )
        );
        if (selectedFiles.length === 0) {
            setError("These images are already selected.");
            return;
        }
        const maxSize = 5 * 1024 * 1024; // 5MB

        // Check file size
        if (selectedFiles.some(file => file.size > maxSize)) {
            setError("Each image must be under 5MB");
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (selectedFiles.some(file => !allowedTypes.includes(file.type))) {
            setError("Only JPG, PNG, or WEBP images are allowed.");
            return;
        }

        // Check total image count
        if (images.length + selectedFiles.length > 5) {
            setError("You can upload a maximum of 5 images");
            return;
        }

        setError("");
        setImages(prev => [...prev, ...selectedFiles]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !price || !quantity || !description || !category || images.length === 0) {
            setError("Please fill in all required fields and upload at least one image.");
            return;
        }
        if (!title.trim() || !description.trim()) {
            setError("Title and description cannot be empty spaces.");
            return;
        }
        if (Number(price) <= 0 || Number(quantity) <= 0) {
            setError("Price and quantity must be greater than zero.");
            return;
        }
        if (!user || !token) {
            setError("You must be logged in to sell an item.");
            return;
        }

        setIsLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("price", String(Number(price)));
        formData.append("quantity", String(Number(quantity)));
        formData.append("description", description);
        formData.append("category", category);
        images.forEach(file => formData.append('images', file));

        try {
            const response = await fetch(`${apiUrl}/api/products`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to post item.");
            }

            toast.success("Item posted successfully! It is now pending admin review.");
            setTitle("");
            setPrice("");
            setQuantity("1");
            setDescription("");
            setCategory("");
            setImages([]);
            navigate("/");
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                <h2 className="text-3xl font-bold text-neutral-800 mb-3">Login Required</h2>
                <p className="text-neutral-600 max-w-md mb-8">You need to be logged in to list an item for sale. Please log in or create an account to continue.</p>
                <button
                    onClick={() => navigate("/")} // Assuming your Navbar login button is on the homepage
                    className="bg-neutral-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-transform transform hover:scale-105"
                >
                    Go to Homepage to Log In
                </button>
            </div>
        );
    }

    const inputStyle = "mt-1 block w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:border-transparent transition";
   
    return (
        <div className="bg-neutral-50 min-h-screen py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-neutral-800">Sell Your Item</h1>
                    <p className="mt-2 text-neutral-500">Fill out the details below to list your product on the marketplace.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
                    {error && <p className="text-red-500 text-sm text-center font-semibold bg-red-50 p-3 rounded-lg">{error}</p>}

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-neutral-600">Item Title</label>
                        <input type="text" id="title" placeholder="e.g., Advanced Engineering Mathematics" value={title} onChange={(e) => setTitle(e.target.value)} className={inputStyle} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-neutral-600">Price (₹)</label>
                            <input type="number" id="price" placeholder="e.g., 300" value={price} onChange={(e) => setPrice(e.target.value)} className={inputStyle} required/>
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-neutral-600">Quantity Available</label>
                            <input type="number" id="quantity" min="1" placeholder="e.g., 2" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputStyle} required/>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-neutral-600">Category</label>
                            <select 
                                id="category" 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)} 
                                className={inputStyle} 
                                required
                            >
                                <option value="">Select a category</option>
                                <option value="Books">Books</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Lab Equipment">Lab Equipment</option>
                                <option value="Stationery">Stationery</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Cycle">Cycle</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label 
                            htmlFor="description" 
                            className="block text-sm font-medium text-neutral-600">
                                Description
                        </label>
                        <textarea 
                            id="description" 
                            placeholder="Describe the item's condition, age, any defects, etc." 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            rows={5} 
                            className={inputStyle} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-600">Upload Images (up to 5)</label>
                        {previews.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
                                {previews.map((url, idx) => (
                                    <div key={idx} className="relative aspect-square">
                                        <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                                        <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">&times;</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div> 

                    <label
                        htmlFor="file-upload"
                        className="mt-4 flex justify-center items-center w-full px-6 pt-5 pb-6 
                                    border-2 border-neutral-300 border-dashed rounded-md 
                                    cursor-pointer hover:border-neutral-400 transition"
                        >
                        <div className="space-y-1 text-center pointer-events-none">
                            <svg
                            className="mx-auto h-12 w-12 text-neutral-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4V20m0 4v4m-4 4h.01M28 32h.01"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            </svg>

                            <div className="flex justify-center text-sm text-neutral-600">
                            <span className="font-medium text-neutral-700">
                                Click anywhere to upload
                            </span>
                            <p className="pl-1">or drag and drop</p>
                            </div>

                            <p className="text-xs text-neutral-500">
                            PNG, JPG, WEBP up to 5MB
                            </p>
                        </div>

                        <input 
                            key={images.length}
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            multiple accept="image/*" 
                            onChange={(e) => handleImageSelect(e.target.files)} 
                            className="sr-only"
                        />
                        </label>

                    <button type="submit" disabled={ isLoading || images.length === 0 } className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-neutral-700 hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2">
                        { isLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> }
                        { isLoading ? "Submitting..." : "Submit for Review" }
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Sell;