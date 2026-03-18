"use client";

import { Button } from "@/components/ui/button";
import { List, LayoutGrid } from "lucide-react";

interface ProductViewToggleProps {
    view: "list" | "card";
    onViewChange: (view: "list" | "card") => void;
}

export default function ProductViewToggle({ view, onViewChange }: ProductViewToggleProps) {
    return (
        <div className="flex items-center border rounded-lg p-1 bg-muted/30">
            <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewChange("list")}
                className="h-8 px-3"
            >
                <List className="h-4 w-4 mr-2" />
                List
            </Button>
            <Button
                variant={view === "card" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewChange("card")}
                className="h-8 px-3"
            >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Cards
            </Button>
        </div>
    );
}
