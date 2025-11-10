Housery POS - Backend

Setup:
1. Copy files into backend/
2. Create .env (see .env.example)
3. npm install
4. npm run seed     # optional to load mock data
5. npm run dev      # starts with nodemon

API base: http://localhost:5000/api

Endpoints:
- Items:    GET/POST /api/items  | GET/PUT/DELETE /api/items/:id
- Customers:GET/POST /api/customers | GET/PUT/DELETE /api/customers/:id
- Suppliers:GET/POST /api/suppliers | PUT/DELETE /api/suppliers/:id
- Sales:    GET/POST /api/sales | GET/PUT/DELETE /api/sales/:id
- Payments: GET/POST /api/payments | GET/DELETE /api/payments/:id

Notes:
- Sale creation (/api/sales POST) decrements stock inside a transaction. Make sure your MongoDB supports transactions (replica set) for true transactions; otherwise it still works but without full transaction guarantees.
- Adjust schema fields to match your frontend exactly (IDs, date formats).
