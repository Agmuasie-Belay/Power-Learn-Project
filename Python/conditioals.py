# Function to calculate discounted price
def calculate_discount(price, discount_percent):
    if discount_percent >= 20:
        discount_amount = (discount_percent / 100) * price
        final_price = price - discount_amount
        return final_price
    else:
        return price

# Prompt user for input
try:
    original_price = float(input("Enter the original price: "))
    discount_percent = float(input("Enter the discount percentage: "))

    # Calculate final price
    final_price = calculate_discount(original_price, discount_percent)

    # Display result
    if final_price < original_price:
        print(f"Discount applied! Final price: {final_price:.2f}")
    else:
        print(f"No discount applied. Price remains: {original_price:.2f}")

except ValueError:
    print("Please enter valid numeric values for price and discount.")
