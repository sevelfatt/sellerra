import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Cart from "./Cart";
import { Product } from "@/models/product";

// Mock the Lucide icons to avoid rendering issues in tests
jest.mock("lucide-react", () => ({
  Minus: () => <div data-testid="minus-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
}));

const mockProducts: Product[] = [
  new Product({
    id: 1,
    name: "Test Product 1",
    price: 10000,
    stocks: 5,
  }),
  new Product({
    id: 2,
    name: "Test Product 2",
    price: 20000,
    stocks: 2,
  }),
];

const mockItems = [
  { product: mockProducts[0], quantity: 1 },
  { product: mockProducts[1], quantity: 2 },
];

describe("Cart Component", () => {
  const mockOnRemove = jest.fn();
  const mockOnUpdateQuantity = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render 'Cart is empty' when there are no items", () => {
    render(
      <Cart
        items={[]}
        onRemove={mockOnRemove}
        onUpdateQuantity={mockOnUpdateQuantity}
      />
    );
    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
  });

  it("should render cart items correctly", () => {
    render(
      <Cart
        items={mockItems}
        onRemove={mockOnRemove}
        onUpdateQuantity={mockOnUpdateQuantity}
      />
    );

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    expect(screen.getByText("Rp 10.000 / unit")).toBeInTheDocument();
    expect(screen.getByText("Rp 20.000 / unit")).toBeInTheDocument();
    expect(screen.getByText("Rp 10.000")).toBeInTheDocument(); // Subtotal for item 1
    expect(screen.getByText("Rp 40.000")).toBeInTheDocument(); // Subtotal for item 2
  });

  it("should call onUpdateQuantity when plus/minus buttons are clicked", () => {
    render(
      <Cart
        items={mockItems}
        onRemove={mockOnRemove}
        onUpdateQuantity={mockOnUpdateQuantity}
      />
    );

    const minusButtons = screen.getAllByRole("button").filter(btn => btn.querySelector('[data-testid="minus-icon"]'));
    const plusButtons = screen.getAllByRole("button").filter(btn => btn.querySelector('[data-testid="plus-icon"]'));

    fireEvent.click(minusButtons[0]);
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, -1);

    fireEvent.click(plusButtons[0]);
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, 1);
  });

  it("should call onRemove when trash button is clicked", () => {
    render(
      <Cart
        items={mockItems}
        onRemove={mockOnRemove}
        onUpdateQuantity={mockOnUpdateQuantity}
      />
    );

    const trashButtons = screen.getAllByRole("button").filter(btn => btn.querySelector('[data-testid="trash-icon"]'));
    fireEvent.click(trashButtons[0]);
    expect(mockOnRemove).toHaveBeenCalledWith(1);
  });

  it("should disable plus button when stock limit is reached", () => {
    // Product 2 has quantity 2 and stocks 2
    render(
      <Cart
        items={mockItems}
        onRemove={mockOnRemove}
        onUpdateQuantity={mockOnUpdateQuantity}
      />
    );

    const plusButtons = screen.getAllByRole("button").filter(btn => btn.querySelector('[data-testid="plus-icon"]'));
    // The second plus button (for Product 2) should be disabled
    expect(plusButtons[1]).toBeDisabled();
    expect(screen.getByText(/stock limit reached \(2\)/i)).toBeInTheDocument();
  });
});
