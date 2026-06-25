import datetime
from fastapi import APIRouter, HTTPException, Request, status
from pathlib import Path
import json
from models import LoginRequest, RegisterRequest

router = APIRouter()

DATA_FILE = Path(__file__).parent / "data" / "login.json"
SHOP_FILE = Path(__file__).parent / "data" / "shop.json"
ORDERS_FILE = Path(__file__).parent / "data" / "orders.json"

def load_users():
    if DATA_FILE.exists():
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

@router.post("/login", status_code=status.HTTP_200_OK)
def login(req: LoginRequest):
    users = load_users()
    user = users.get(req.username)
    if not user or str(user.get("pass")) != req.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    # Return user info (excluding password)
    return {
        "msg": "Login successful",
        "username": req.username,
        "name": user.get("name", ""),
        "email": req.username,  # assuming username is email
        "sdt": user.get("sdt", "")
    }

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest):
    users = load_users()
    if req.username in users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )
    users[req.username] = {
        "name": req.name,
        "pass": req.password
    }
    save_users(users)
    return {"msg": "User registered"}



def load_shop_products():
    if SHOP_FILE.exists():
        with open(SHOP_FILE, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
                return data.get("products", []) if isinstance(data, dict) else data
            except Exception:
                return []
    return []

@router.get("/orders/{acc}")
def get_orders_for_account(acc: str):
    """Return enriched order products for a given account (acc/email).
    Response format: { acc: 'email', products: [ {id, quantity, name, img, price, mota}, ... ] }
    """
    orders = load_orders()
    target = None
    for o in orders:
        if (o.get("acc") or "").lower() == acc.lower():
            target = o
            break
    if not target:
        raise HTTPException(status_code=404, detail="Order not found")
    products = target.get("products", [])
    shop = load_shop_products()
    enriched = []
    for p in products:
        pid = p.get("id")
        prod = next((x for x in shop if str(x.get("id")) == str(pid)), None)
        enriched.append({
            "id": pid,
            "quantity": p.get("quantity", 1),
            "name": prod.get("TieuDe") if prod else f"Product {pid}",
            "img": prod.get("img") if prod else "",
            "price": prod.get("tien") if prod else 0,
            "mota": prod.get("MoTa") if prod else "",
        })
    return {"acc": target.get("acc"), "products": enriched}

def load_orders():
    if ORDERS_FILE.exists():
        with open(ORDERS_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except Exception:
                return []
    return []

def save_orders(orders):
    with open(ORDERS_FILE, "w", encoding="utf-8") as f:
        json.dump(orders, f, indent=2, ensure_ascii=False)

@router.post("/order", status_code=status.HTTP_201_CREATED)
async def place_order(request: Request):
    """
    Accepts JSON body: { "username": "user@example.com", "items": [ { "id": 1, "name": "...", "price": "...", "qty": 2 }, ...] }

    Will store orders in the legacy format used by data/orders.json:
    [ { "acc": "user@example.com", "products": [ {"id": ..., "quantity": ...}, ... ] }, ... ]
    """
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid JSON body')

    username = body.get('username') or body.get('email') or ''
    items = body.get('items') or []

    if not username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Missing username')
    if not isinstance(items, list) or len(items) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Missing items')

    # Normalize items into products list (id + quantity)
    products = []
    for it in items:
        try:
            pid = int(it.get('id'))
        except Exception:
            pid = it.get('id')
        qty = int(it.get('qty', it.get('quantity', 1)))
        products.append({'id': pid, 'quantity': qty})

    # Compute total using price fields if provided
    total = 0.0
    for it in items:
        try:
            import re
            price_raw = it.get('price', '0')
            num = re.findall(r"[\d.,]+", str(price_raw))
            price = float(num[0].replace(',', '')) if num else 0.0
        except Exception:
            price = 0.0
        qty = int(it.get('qty', it.get('quantity', 1)))
        total += price * qty

    # Build order entry in legacy shape
    order_entry = {
        'acc': username,
        'products': products,
        'total': total,
        'timestamp': datetime.now().isoformat()
    }

    orders = load_orders()
    orders.append(order_entry)
    save_orders(orders)
    return {"msg": "Order placed", "order_id": len(orders)}