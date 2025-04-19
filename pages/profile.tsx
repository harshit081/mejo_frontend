import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from './utils/withAuth';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import AccountLayout from '../components/AccountLayout';

interface UserProfile {
    _id: string;
    userId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    dateOfBirth: string | null;
    gender: 'male' | 'female' | 'other' | 'prefer not to say';
    phoneNumber: string | null;
    address: {
        street: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        zipCode: string | null;
    };
    bio: string | null;
    preferences: {
        emailNotifications: boolean;
        theme: 'light' | 'dark';
    };
    profilePicture: string;
    createdAt: string;
    updatedAt: string;
}

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [activeSection, setActiveSection] = useState('basic');
    const router = useRouter();

    const sections = [
        { id: 'basic', icon: '👤', title: 'Basic Information' },
        { id: 'contact', icon: '📞', title: 'Contact Details' },
        { id: 'address', icon: '📍', title: 'Address Information' },
        { id: 'bio', icon: '✍️', title: 'Bio' }
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                router.push('/login');
                return;
            }

            console.log("Fetching profile with token:", token); // Debug log

            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            console.log("Profile response status:", response.status); // Debug log

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch profile');
            }

            const data = await response.json();
            console.log("Received profile data:", data); // Debug log
            setProfile(data);
        } catch (error) {
            console.error("Profile fetch error:", error); // Debug log
            setError(error instanceof Error ? error.message : 'Failed to load profile');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = Cookies.get('token');
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profile)
            });

            if (!response.ok) throw new Error('Failed to update profile');
            
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            setError('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setProfile(prev => {
                if (!prev) return null;
                
                if (parent === 'address') {
                    return {
                        ...prev,
                        address: {
                            ...prev.address,
                            [child]: value
                        }
                    };
                }
                
                if (parent === 'preferences') {
                    return {
                        ...prev,
                        preferences: {
                            ...prev.preferences,
                            [child]: value
                        }
                    };
                }
                
                return prev;
            });
        } else {
            setProfile(prev => prev ? { ...prev, [name]: value } : null);
        }
    };

    return (
        <AccountLayout>
            <div className="max-w-4xl">
                <div className="mb-8 flex space-x-4 overflow-x-auto pb-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => {
                                setActiveSection(section.id);
                                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap transition-all
                                ${activeSection === section.id 
                                    ? 'bg-healing-500 text-white' 
                                    : 'bg-white text-gray-600 hover:bg-healing-100'}`}
                        >
                            <span>{section.icon}</span>
                            <span>{section.title}</span>
                        </button>
                    ))}
                </div>

                <motion.div 
                    className="bg-white rounded-2xl shadow-xl p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-6 py-3 rounded-lg font-medium ${
                                isEditing 
                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                                    : 'bg-healing-500 text-white hover:bg-healing-600'
                            }`}
                        >
                            {isEditing ? '✕ Cancel' : '✏️ Edit Profile'}
                        </motion.button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Basic Information */}
                        <section id="basic" className="scroll-mt-24">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                                <span className="mr-2">👤</span> Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={profile?.email || ''}
                                        disabled
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500"
                                    />
                                </div>
                                
                                <motion.div
                                    whileHover={isEditing ? { y: -2 } : {}}
                                    className="space-y-1"
                                >
                                    <label className="block text-sm font-medium text-gray-700">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={profile?.firstName || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-healing-300 focus:border-healing-500 transition-all duration-200"
                                    />
                                </motion.div>

                                <motion.div
                                    whileHover={isEditing ? { y: -2 } : {}}
                                    className="space-y-1"
                                >
                                    <label className="block text-sm font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={profile?.lastName || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-healing-300 focus:border-healing-500 transition-all duration-200"
                                    />
                                </motion.div>

                                <motion.div whileHover={isEditing ? { y: -2 } : {}}>
                                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-healing-300 focus:border-healing-500"
                                    />
                                </motion.div>
                                
                                <motion.div whileHover={isEditing ? { y: -2 } : {}}>
                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                    <select
                                        name="gender"
                                        value={profile?.gender || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-healing-300 focus:border-healing-500"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer not to say">Prefer not to say</option>
                                    </select>
                                </motion.div>
                            </div>
                        </section>

                        {/* Contact Details */}
                        <section id="contact" className="scroll-mt-24">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                                <span className="mr-2">📞</span> Contact Details
                            </h2>
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                            >
                                {/* Phone field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={profile?.phoneNumber || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-healing-300 focus:border-healing-500 transition-all duration-200"
                                    />
                                </div>
                            </motion.div>
                        </section>

                        {/* Address Information */}
                        <section id="address" className="scroll-mt-24">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                                <span className="mr-2">📍</span> Address Information
                            </h2>
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                            >
                                <>
                                    <motion.div 
                                        whileHover={isEditing ? { y: -2 } : {}}
                                        className="space-y-1"
                                    >
                                        <label className="block text-sm font-medium text-gray-700">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address.street"
                                            value={profile?.address?.street || ''}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-healing-300 focus:border-healing-500 transition-all duration-200"
                                            placeholder="Street address"
                                        />
                                    </motion.div>

                                    <motion.div 
                                        whileHover={isEditing ? { y: -2 } : {}}
                                        className="space-y-1"
                                    >
                                        <label className="block text-sm font-medium text-gray-700">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="address.city"
                                            value={profile?.address?.city || ''}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-healing-300 focus:border-healing-500 transition-all duration-200"
                                            placeholder="City"
                                        />
                                    </motion.div>

                                    <motion.div 
                                        whileHover={isEditing ? { y: -2 } : {}}
                                        className="space-y-1"
                                    >
                                        <label className="block text-sm font-medium text-gray-700">
                                            State/Province
                                        </label>
                                        <input
                                            type="text"
                                            name="address.state"
                                            value={profile?.address?.state || ''}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-healing-300 focus:border-healing-500 transition-all duration-200"
                                            placeholder="State or province"
                                        />
                                    </motion.div>

                                    <motion.div 
                                        whileHover={isEditing ? { y: -2 } : {}}
                                        className="space-y-1"
                                    >
                                        <label className="block text-sm font-medium text-gray-700">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            name="address.country"
                                            value={profile?.address?.country || ''}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-healing-300 focus:border-healing-500 transition-all duration-200"
                                            placeholder="Country"
                                        />
                                    </motion.div>

                                    <motion.div 
                                        whileHover={isEditing ? { y: -2 } : {}}
                                        className="space-y-1"
                                    >
                                        <label className="block text-sm font-medium text-gray-700">
                                            ZIP/Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            name="address.zipCode"
                                            value={profile?.address?.zipCode || ''}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-healing-300 focus:border-healing-500 transition-all duration-200"
                                            placeholder="ZIP or postal code"
                                        />
                                    </motion.div>
                                </>
                            </motion.div>
                        </section>

                        {/* Bio Section */}
                        <section id="bio" className="scroll-mt-24">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                                <span className="mr-2">✍️</span> Bio
                            </h2>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                            >
                                <textarea
                                    name="bio"
                                    value={profile?.bio || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-healing-300 focus:border-healing-500 transition-all duration-200"
                                    placeholder={isEditing ? "Tell us about yourself..." : ""}
                                />
                            </motion.div>
                        </section>

                        {/* Account Information */}
                        <section className="mt-8 pt-8 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500">Account Information</h3>
                            <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                    <p>Member since</p>
                                    <p className="font-medium">{new Date(profile?.createdAt || '').toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p>Last updated</p>
                                    <p className="font-medium">{new Date(profile?.updatedAt || '').toLocaleDateString()}</p>
                                </div>
                            </div>
                        </section>

                        {/* Submit Button */}
                        {isEditing && (
                            <motion.div 
                                className="sticky bottom-4 flex justify-end"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-3 bg-healing-500 text-white rounded-lg font-medium hover:bg-healing-600 transition-colors disabled:bg-gray-400"
                                >
                                    {loading ? (
                                        <div className="loader mx-auto" />
                                    ) : (
                                        'Save Changes'
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </form>
                </motion.div>
            </div>
        </AccountLayout>
    );
};

export default withAuth(Profile);