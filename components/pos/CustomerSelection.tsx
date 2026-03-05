"use client";

import { useState } from "react";
import { customer } from "@/models/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X, Check } from "lucide-react";
import { createNewCustomer } from "@/services/customer/customerServiceClient";

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateCustomer = async () => {
        if (!newName.trim()) return;
        setIsSubmitting(true);
        try {
            const newCust = await createNewCustomer(userId, newName);
            onSelect(newCust);
            setIsAddingNew(false);
            setNewName("");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (selected) {
        return (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5 border-primary/20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {selected.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-sm">{selected.name}</p>
                        <p className="text-[10px] text-muted-foreground">ID: {selected.id}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onSelect(null)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    if (isAddingNew) {
        return (
            <div className="space-y-2">
                <Input 
                    placeholder="Enter customer name..." 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                />
                <div className="flex gap-2">
                    <Button className="flex-1" size="sm" onClick={handleCreateCustomer} disabled={isSubmitting || !newName.trim()}>
                        {isSubmitting ? "Saving..." : "Create & Select"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsAddingNew(false)}>Cancel</Button>
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
                        Search customers...
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
                            placeholder="Type to search..." 
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
                            <p className="p-3 text-xs text-center text-muted-foreground">No customers found</p>
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
