import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { authService, fileService } from '@/api/services';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, User, Upload, Trash2, Loader2, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export default function DashboardProfile() {
    const { user, setUser } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        bio: '',
        agency_name: '',
        license_number: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone: user.phone || '',
                bio: user.bio || '',
                agency_name: user.agency_name || '',
                license_number: user.license_number || '',
                avatar_url: user.avatar_url || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle avatar file upload
    const handleAvatarFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check (10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Avatar image must be under 10MB.",
                variant: "destructive"
            });
            return;
        }

        setSelectedFileName(file.name);
        
        // Immediate local preview
        const localPreview = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, avatar_url: localPreview }));
        setUploadingAvatar(true);

        try {
            const uploadRes = await fileService.upload(file);
            const uploadedUrl = uploadRes.url || uploadRes.file_url;
            setFormData(prev => ({ ...prev, avatar_url: uploadedUrl }));

            // Automatically persist avatar change to user account
            const updatedUser = await authService.updateMe({
                ...formData,
                avatar_url: uploadedUrl
            });
            setUser(updatedUser);

            toast({
                title: "Avatar updated",
                description: "Your profile picture has been uploaded and saved.",
            });
        } catch (error) {
            console.error("Avatar upload failed:", error);
            // Revert preview on failure
            setFormData(prev => ({ ...prev, avatar_url: user?.avatar_url || '' }));
            toast({
                title: "Upload failed",
                description: error.response?.data?.error || "Could not upload image. Please try again.",
                variant: "destructive"
            });
        } finally {
            setUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Remove current avatar
    const handleRemoveAvatar = async () => {
        setFormData(prev => ({ ...prev, avatar_url: '' }));
        setSelectedFileName('');
        try {
            const updatedUser = await authService.updateMe({
                ...formData,
                avatar_url: ''
            });
            setUser(updatedUser);
            toast({
                title: "Avatar removed",
                description: "Your profile picture has been reset.",
            });
        } catch (error) {
            console.error("Failed to remove avatar:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedUser = await authService.updateMe(formData);
            setUser(updatedUser);
            toast({
                title: "Profile Updated",
                description: "Your profile information has been successfully updated.",
            });
        } catch (error) {
            console.error("Failed to update profile", error);
            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to update profile. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const isAgent = user?.role === 'agent';

    return (
        <div className="max-w-3xl mx-auto py-2">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                    <p className="text-slate-500 text-sm">
                        Manage your account settings, avatar, and contact details
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-xs border border-border p-6 md:p-8 space-y-8">
                {/* Account Summary Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg overflow-hidden border border-border shrink-0">
                            {formData.avatar_url ? (
                                <img src={formData.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                user?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-base font-bold text-slate-900">{user?.full_name || user?.email}</h2>
                                <Badge variant="secondary" className="capitalize text-xs font-semibold">
                                    {user?.role}
                                </Badge>
                                {isAgent && user?.agent_status === 'approved' && (
                                    <Badge className="bg-emerald-500 text-white text-[11px] gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Approved Agent
                                    </Badge>
                                )}
                                {isAgent && user?.agent_status === 'pending' && (
                                    <Badge className="bg-amber-500 text-white text-[11px] gap-1">
                                        <Clock className="w-3 h-3" /> Pending Approval
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                    </div>
                    <div className="text-left sm:text-right">
                        <span className="text-[11px] text-slate-400 block uppercase font-medium">Plan</span>
                        <span className="text-sm font-semibold text-primary">{user?.subscription_plan || 'Free'}</span>
                    </div>
                </div>

                {/* AVATAR SECTION */}
                <div className="space-y-4 pb-6 border-b border-border">
                    <h3 className="text-base font-bold text-slate-900">Avatar</h3>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        {/* Circular Avatar Preview */}
                        <div className="relative group w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                            {formData.avatar_url ? (
                                <img 
                                    src={formData.avatar_url} 
                                    alt="Profile Avatar" 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <User className="w-12 h-12 text-slate-400" />
                            )}
                            {uploadingAvatar && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Upload Controls */}
                        <div className="flex-1 space-y-2">
                            <p className="text-sm font-medium text-slate-700">Upload a new avatar</p>
                            
                            <div className="flex items-center gap-3 flex-wrap">
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleAvatarFileChange}
                                    className="hidden" 
                                    id="avatar-file-input"
                                    disabled={uploadingAvatar}
                                />
                                <label 
                                    htmlFor="avatar-file-input"
                                    className={`inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors ${
                                        uploadingAvatar ? 'opacity-50 pointer-events-none' : ''
                                    }`}
                                >
                                    {uploadingAvatar ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-3.5 h-3.5 text-slate-600" />
                                            Choose File
                                        </>
                                    )}
                                </label>
                                
                                <span className="text-xs text-slate-500 truncate max-w-[200px]">
                                    {selectedFileName || (formData.avatar_url ? 'Photo selected' : 'No file chosen')}
                                </span>

                                {formData.avatar_url && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveAvatar}
                                        disabled={uploadingAvatar}
                                        className="text-xs text-rose-600 hover:text-rose-700 font-medium inline-flex items-center gap-1 hover:underline ml-auto"
                                    >
                                        <Trash2 className="w-3 h-3" /> Remove
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                                <span>JPEG 100x100 (JPG, PNG, WEBP. Max 10MB)</span>
                                <button
                                    type="button"
                                    onClick={() => setShowUrlInput(!showUrlInput)}
                                    className="text-primary hover:underline"
                                >
                                    {showUrlInput ? 'Hide image URL' : 'Or paste image URL'}
                                </button>
                            </div>

                            {showUrlInput && (
                                <div className="pt-2">
                                    <Input 
                                        name="avatar_url" 
                                        value={formData.avatar_url} 
                                        onChange={handleChange} 
                                        placeholder="https://example.com/avatar.jpg"
                                        className="text-xs h-8"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* FORM DETAILS */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">First Name</label>
                            <Input 
                                name="first_name" 
                                value={formData.first_name} 
                                onChange={handleChange} 
                                placeholder="e.g. John" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Last Name</label>
                            <Input 
                                name="last_name" 
                                value={formData.last_name} 
                                onChange={handleChange} 
                                placeholder="e.g. Doe" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Phone Number</label>
                            <Input 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                placeholder="+1 (555) 123-4567" 
                            />
                        </div>

                        {isAgent && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Agency Name</label>
                                    <Input 
                                        name="agency_name" 
                                        value={formData.agency_name} 
                                        onChange={handleChange} 
                                        placeholder="e.g. Century 21 Premier" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">License Number</label>
                                    <Input 
                                        name="license_number" 
                                        value={formData.license_number} 
                                        onChange={handleChange} 
                                        placeholder="e.g. RE-984721" 
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">About / Bio</label>
                        <Textarea 
                            name="bio" 
                            value={formData.bio} 
                            onChange={handleChange} 
                            rows={4}
                            placeholder="Write a brief introduction about yourself..." 
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                        <Button type="submit" disabled={loading || uploadingAvatar} className="gap-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {loading ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
