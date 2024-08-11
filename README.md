In this project, Lets build An Interactive Application

# Stakehubs Assignment Reference Document

### Database Design:

1. *SQLite Database Setup*:
    - Create two main tables: PendingOrderTable and CompletedOrderTable.
    - PendingOrderTable fields: id, buyer_qty, buyer_price, seller_price, seller_qty.
    - CompletedOrderTable fields: id, price, qty.
2. *Indexing*:
    - Consider adding indexes on buyer_price and seller_price in the PendingOrderTable to speed up the price matching query process.

### Backend Setup (Node.js):

1. *API Development*:
    - *Create Order API*: Accepts buyer or seller orders and inserts them into the PendingOrderTable.
    - *Match Orders API*: Checks for matches between buyer and seller prices; moves matched orders to CompletedOrderTable.
    - *Get Orders API*: Fetches current orders from both tables.
2. *Matching Logic*:
    - When a new order is added, the system should trigger a check in the PendingOrderTable to find any matching seller/buyer orders.
    - A match is found when buyer_price >= seller_price. Move the minimum quantity of the matched order to CompletedOrderTable and update quantities in PendingOrderTable as necessary.
3. *Transaction Management*:
    - Use SQLite transaction features to handle concurrent order placements and ensure data integrity.

### Frontend Setup (React.js):

1. *User Interface*:
    - *Order Placement Form*: Allows users to input order details (buy/sell, quantity, price).
    - *Order Tables Display*: Show current pending and completed orders.
    - *Dynamic Price Chart*: Use a library like Chart.js or Recharts to display price points over time based on completed orders.
2. *State Management*:
    - Use React state hooks (e.g., useState, useEffect) to manage and update the UI based on the fetched data from the backend.
    - Consider using context API or Redux for more complex state management if needed.
3. *Real-time Data Handling*:
    - Implement WebSocket or polling to update the order tables and price chart in real-time as new orders are matched and completed.

### Additional Features:

- *Form Validation*: Ensure that user inputs are valid (e.g., non-negative numbers, logical price/quantity entries).
- *Responsive Design*: Make sure the UI is responsive and accessible on different devices.
- *User Feedback*: Implement loader icons and messages to indicate processing states or errors to the user.

### Testing:

- Write tests for both frontend components and backend APIs using frameworks like Jest (for React) and Mocha/Chai (for Node.js).
- Ensure you cover edge cases like simultaneous order placements, invalid inputs, and order matching logic.

### Deployment:

- Consider deploying the backend on platforms like Render or AWS and the frontend on Netlify or Vercel.
