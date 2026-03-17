"use client";

import { useState } from "react";
import { customer } from "@/models/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X, Check, Phone, Edit2, Save } from "lucide-react";
import { createNewCustomer, updateCustomer } from "@/services/customer/customerServiceClient";

interface CustomerSelectionProps {
    userId: string;
    customers: customer[];
    selected: customer | null;
    onSelect: (customer: customer | null) => void;
}

export default function CustomerSelection({ userId, customers, selected, onSelect }: CustomerSelectionProps) {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newName, setNewName] = useState("");
    const [newWhatsApp, setNewWhatsApp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Edit mode states
    const [isEditing, setIsEditing] = useState(false);
    const [editWhatsApp, setEditWhatsApp] = useState("");

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateCustomer = async () => {
        if (!newName.trim()) return;
        setIsSubmitting(true);
        try {
            const newCust = await createNewCustomer(userId, newName, newWhatsApp);
            // We need to refresh the customers list or manually add it, but since it's passed as prop, 
            // usually parent should handle refreshing or we just select it locally.
            // For now, let's assume onSelect is enough to show it's "selected" even if not in the prop list yet.
            onSelect(newCust);
            setIsAddingNew(false);
            setNewName("");
            setNewWhatsApp("");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateWhatsApp = async () => {
        if (!selected) return;
        setIsSubmitting(true);
        try {
            const updated = await updateCustomer(selected.id, { whatsapp_number: editWhatsApp });
            onSelect(updated);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (selected) {
        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5 border-primary/20">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {selected.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-sm">{selected.name}</p>
                            {!isEditing ? (
                                <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    <p className="text-[10px] text-muted-foreground">
                                        {selected.whatsapp_number || "Tidak ada WhatsApp"}
                                    </p>
                                    <button 
                                        onClick={() => {
                                            setEditWhatsApp(selected.whatsapp_number || "");
                                            setIsEditing(true);
                                        }}
                                        className="text-[10px] text-primary hover:underline flex items-center gap-0.5 ml-1"
                                    >
                                        <Edit2 className="h-2 w-2" /> Edit
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 mt-1">
                                    <Input 
                                        className="h-6 text-[10px] py-0 px-2 w-24" 
                                        value={editWhatsApp}
                                        onChange={(e) => setEditWhatsApp(e.target.value)}
                                        placeholder="WhatsApp..."
                                        autoFocus
                                    />
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-5 w-5 text-green-600" 
                                        onClick={handleUpdateWhatsApp}
                                        disabled={isSubmitting}
                                    >
                                        <Save className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-5 w-5 text-destructive" 
                                        onClick={() => setIsEditing(false)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onSelect(null)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    if (isAddingNew) {
        return (
            <div className="space-y-2 p-3 border rounded-lg bg-muted/20 animate-in fade-in slide-in-from-top-2">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Tambah Pelanggan Baru</p>
                <div className="space-y-2">
                    <Input 
                        placeholder="Nama Lengkap" 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                        className="h-9"
                    />
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input 
                            placeholder="WhatsApp (Opsional)" 
                            value={newWhatsApp}
                            onChange={(e) => setNewWhatsApp(e.target.value)}
                            className="h-9 pl-9"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button className="flex-1" size="sm" onClick={handleCreateCustomer} disabled={isSubmitting || !newName.trim()}>
                        {isSubmitting ? "Menyimpan..." : "Simpan & Pilih"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsAddingNew(false)}>Batal</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {!isSearching ? (
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        className="flex-1 justify-start gap-2 h-10 px-3 text-muted-foreground font-normal"
                        onClick={() => setIsSearching(true)}
                    >
                        <Search className="h-4 w-4" />
                        Cari pelanggan...
                    </Button>
                    <Button variant="secondary" size="icon" className="h-10 w-10 shrink-0" onClick={() => setIsAddingNew(true)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="relative border rounded-lg bg-popover shadow-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-2 border-b flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Ketik untuk mencari..." 
                            className="border-none focus-visible:ring-0 h-8 p-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsSearching(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="max-h-48 overflow-y-auto p-1">
                        {filteredCustomers.length === 0 ? (
                            <p className="p-3 text-xs text-center text-muted-foreground">Pelanggan tidak ditemukan</p>
                        ) : (
                            filteredCustomers.map(c => (
                                <button
                                    key={c.id}
                                    className="w-full text-left p-2 hover:bg-muted rounded text-sm flex items-center justify-between group"
                                    onClick={() => {
                                        onSelect(c);
                                        setIsSearching(false);
                                    }}
                                >
                                    <span>{c.name}</span>
                                    <Check className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100" />
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
