import { uploadImage, deleteImage, getPublicUrl } from "./productImageService";
import { createClient } from "@/lib/supabase/client";

jest.mock("@/lib/supabase/client");

describe("productImageService", () => {
    const mockUpload = jest.fn();
    const mockRemove = jest.fn();
    const mockGetPublicUrl = jest.fn();
    const mockFrom = jest.fn();

    const mockSupabase = {
        storage: {
            from: mockFrom.mockReturnValue({
                upload: mockUpload,
                remove: mockRemove,
                getPublicUrl: mockGetPublicUrl,
            }),
        },
    };

    beforeEach(() => {
        (createClient as jest.Mock).mockReturnValue(mockSupabase);
        jest.clearAllMocks();
    });

    describe("uploadImage", () => {
        it("successfully uploads an image", async () => {
            const file = new File(["test content"], "test.png", { type: "image/png" });
            const path = "products/test.png";
            
            mockUpload.mockResolvedValue({
                data: { path },
                error: null,
            });

            const result = await uploadImage(file, path);

            expect(result).toEqual({ path });
            expect(mockFrom).toHaveBeenCalledWith("product_pictures");
            expect(mockUpload).toHaveBeenCalledWith(path, file);
        });

        it("throws an error when upload fails", async () => {
            const file = new File(["test content"], "test.png", { type: "image/png" });
            const path = "products/test.png";
            const error = { message: "Upload failed" };

            mockUpload.mockResolvedValue({
                data: null,
                error,
            });

            await expect(uploadImage(file, path)).rejects.toThrow("Upload failed");
        });
    });

    describe("deleteImage", () => {
        it("successfully deletes an image", async () => {
            const path = "products/test.png";
            
            mockRemove.mockResolvedValue({
                data: { path },
                error: null,
            });

            await expect(deleteImage(path)).resolves.not.toThrow();
            expect(mockFrom).toHaveBeenCalledWith("product_pictures");
            expect(mockRemove).toHaveBeenCalledWith([path]);
        });

        it("throws an error when deletion fails", async () => {
            const path = "products/test.png";
            const error = { message: "Delete failed" };

            mockRemove.mockResolvedValue({
                data: null,
                error,
            });

            await expect(deleteImage(path)).rejects.toThrow("Delete failed");
        });
    });

    describe("getPublicUrl", () => {
        it("returns the public URL of an image", () => {
            const path = "products/test.png";
            const publicUrl = "https://example.com/storage/v1/object/public/product_pictures/products/test.png";
            
            mockGetPublicUrl.mockReturnValue({
                data: { publicUrl },
            });

            const result = getPublicUrl(path);

            expect(result).toBe(publicUrl);
            expect(mockFrom).toHaveBeenCalledWith("product_pictures");
            expect(mockGetPublicUrl).toHaveBeenCalledWith(path);
        });
    });
});
