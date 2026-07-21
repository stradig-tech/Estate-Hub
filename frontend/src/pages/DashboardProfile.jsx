import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { authService } from '@/api/services';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, User } from 'lucide-react';

export default function DashboardProfile() {
    const { user, setUser } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        bio: '',
        agency_name: '',
        license_number: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
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
                description: "Failed to update profile. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                    <p className="text-slate-500 text-sm">Manage your personal and agency information</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                    <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                        {formData.avatar_url ? (
                            <img src={formData.avatar_url} alt="Profile Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-slate-400" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{user?.email}</h3>
                        <p className="text-sm text-muted-foreground capitalize mb-3">Role: {user?.role}</p>
                        <p className="text-xs text-slate-400">Subscription: <span className="font-semibold text-primary">{user?.subscription_plan}</span> ({user?.subscription_status})</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Avatar URL</label>
                            <Input 
                                name="avatar_url" 
                                value={formData.avatar_url} 
                                onChange={handleChange} 
                                placeholder="https://example.com/my-photo.jpg" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <Input 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                placeholder="+1 (555) 123-4567" 
                            />
                        </div>
                        {user?.role === 'agent' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Agency Name</label>
                                    <Input 
                                        name="agency_name" 
                                        value={formData.agency_name} 
                                        onChange={handleChange} 
                                        placeholder="e.g. Century 21" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">License Number</label>
                                    <Input 
                                        name="license_number" 
                                        value={formData.license_number} 
                                        onChange={handleChange} 
                                        placeholder="e.g. BRE-1234567" 
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Bio</label>
                        <Textarea 
                            name="bio" 
                            value={formData.bio} 
                            onChange={handleChange} 
                            rows="5"
                            placeholder="Tell clients a bit about yourself..." 
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={loading} className="gap-2">
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
