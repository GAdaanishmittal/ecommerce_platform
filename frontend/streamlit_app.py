import base64
import json
from datetime import datetime

import requests
import streamlit as st

st.set_page_config(page_title="Ecommerce API Console", layout="wide")

# Keep lightweight state for recent calls
st.session_state.setdefault("recent_calls", [])
st.session_state.setdefault("token", "")


def parse_json(text):
    if not text or not text.strip():
        return None, None
    try:
        return json.loads(text), None
    except json.JSONDecodeError as exc:
        return None, f"Invalid JSON: {exc}"


def call_api(method, base_url, path, token, params=None, payload=None):
    url = base_url.rstrip("/") + path
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    try:
        response = requests.request(
            method=method,
            url=url,
            headers=headers,
            params=params,
            json=payload,
            timeout=20,
        )
    except requests.RequestException as exc:
        return None, f"Request failed: {exc}"

    content_type = response.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = response.json()
        except ValueError:
            body = response.text
    else:
        body = response.text
    return response, body


def remember_call(path, response, body):
    entry = {
        "path": path,
        "status": response.status_code if response is not None else None,
        "time": datetime.now().strftime("%H:%M:%S"),
        "body": body if isinstance(body, (dict, list, str)) else str(body),
    }
    st.session_state["recent_calls"] = ([entry] + st.session_state["recent_calls"])[:6]


def show_response(response, body):
    if response is None:
        st.error(body)
        return
    st.caption(f"Status: {response.status_code}")
    if isinstance(body, (dict, list)):
        st.json(body)
    else:
        st.code(str(body))
    remember_call(response.url if response else "n/a", response, body)


def decode_jwt(token):
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        # Pad base64 for safe decode
        padded = parts[1] + "=" * (-len(parts[1]) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded.encode("utf-8")))
        return payload
    except Exception:
        return None


st.title("Ecommerce API Console")
st.write("Faster testing surface for the Spring Boot ecommerce API.")

with st.sidebar:
    st.header("Connection")
    base_url = st.text_input("Base URL", value="http://localhost:8080")

    col_side_1, col_side_2 = st.columns([3, 2])
    with col_side_1:
        token_value = st.text_area("JWT Token", value=st.session_state.get("token", ""))
    with col_side_2:
        if st.button("Save Token"):
            st.session_state["token"] = token_value.strip()
        if st.button("Clear Token"):
            st.session_state["token"] = ""
            token_value = ""
    token = st.session_state.get("token", "").strip()

    decoded = decode_jwt(token) if token else None
    if decoded:
        st.caption(f"Token subject: {decoded.get('sub')}")
        exp = decoded.get("exp")
        if exp:
            st.caption(f"Expires: {datetime.fromtimestamp(exp)}")
    st.divider()
    if st.button("Ping /actuator/health"):
        resp, body = call_api("GET", base_url, "/actuator/health", token=token)
        show_response(resp, body)
    if st.button("Quick login (demo user)"):
        payload = {"email": "daanish@example.com", "password": "password123"}
        resp, body = call_api("POST", base_url, "/auth/login", None, payload=payload)
        show_response(resp, body)
        if resp and resp.ok and isinstance(body, str):
            st.session_state["token"] = body.strip()
            st.success("Demo token saved.")
    st.divider()
    if st.session_state["recent_calls"]:
        st.subheader("Recent calls")
        for entry in st.session_state["recent_calls"]:
            st.caption(f"{entry['time']} {entry['path']} ({entry['status']})")

tabs = st.tabs(
    [
        "Overview",
        "Auth",
        "Products",
        "Categories",
        "Cart",
        "Orders",
        "Payments",
        "Reviews",
        "Raw Request",
    ]
)

with tabs[0]:
    st.subheader("Quick checks")
    col_a, col_b, col_c = st.columns(3)
    with col_a:
        if st.button("Public products"):
            resp, body = call_api("GET", base_url, "/api/products", token=None)
            show_response(resp, body)
    with col_b:
        if st.button("Categories"):
            resp, body = call_api("GET", base_url, "/api/categories", token=None)
            show_response(resp, body)
    with col_c:
        if st.button("Health check"):
            resp, body = call_api("GET", base_url, "/actuator/health", token=None)
            show_response(resp, body)

    st.subheader("Token snapshot")
    if token:
        st.code(token)
        if decoded:
            st.json(decoded)
    else:
        st.info("No token saved yet. Use Auth tab or Quick login.")

with tabs[1]:
    st.subheader("Register")
    with st.form("register_form"):
        reg_email = st.text_input("Email", key="reg_email")
        reg_password = st.text_input("Password", type="password", key="reg_password")
        reg_phone = st.text_input("Phone", key="reg_phone")
        reg_address = st.text_input("Address", key="reg_address")
        reg_role = st.selectbox("Role", ["CUSTOMER", "ADMIN"], index=0, key="reg_role")
        if st.form_submit_button("Register"):
            payload = {
                "email": reg_email,
                "password": reg_password,
                "phone": reg_phone,
                "address": reg_address,
                "role": reg_role,
            }
            resp, body = call_api("POST", base_url, "/auth/register", token, payload=payload)
            show_response(resp, body)

    st.subheader("Login")
    with st.form("login_form"):
        login_email = st.text_input("Email", key="login_email", value="daanish@example.com")
        login_password = st.text_input(
            "Password", type="password", key="login_password", value="password123"
        )
        if st.form_submit_button("Login"):
            payload = {"email": login_email, "password": login_password}
            resp, body = call_api("POST", base_url, "/auth/login", token, payload=payload)
            show_response(resp, body)
            if resp and resp.ok and isinstance(body, str):
                st.session_state["token"] = body.strip()
                st.success("Token saved in sidebar.")

with tabs[2]:
    st.subheader("List Products")
    if st.button("Get All Products"):
        resp, body = call_api("GET", base_url, "/api/products", token)
        show_response(resp, body)

    st.subheader("Products by Category")
    category_id = st.text_input("Category ID", key="prod_category_id")
    if st.button("Get Products by Category"):
        resp, body = call_api(
            "GET",
            base_url,
            f"/api/products/category/{category_id}",
            token,
        )
        show_response(resp, body)

    st.subheader("Search Products")
    keyword = st.text_input("Keyword", key="prod_keyword")
    if st.button("Search"):
        resp, body = call_api(
            "GET",
            base_url,
            "/api/products/search",
            token,
            params={"keyword": keyword},
        )
        show_response(resp, body)

    st.subheader("Filter Products")
    col1, col2, col3, col4, col5 = st.columns(5)
    with col1:
        f_keyword = st.text_input("Keyword", key="f_keyword")
    with col2:
        f_category = st.text_input("Category ID", key="f_category")
    with col3:
        f_min = st.text_input("Min Price", key="f_min")
    with col4:
        f_max = st.text_input("Max Price", key="f_max")
    with col5:
        f_sort = st.text_input("Sort", key="f_sort")
    if st.button("Apply Filter"):
        params = {}
        if f_keyword:
            params["keyword"] = f_keyword
        if f_category:
            params["categoryId"] = f_category
        if f_min:
            params["minPrice"] = f_min
        if f_max:
            params["maxPrice"] = f_max
        if f_sort:
            params["sort"] = f_sort
        resp, body = call_api(
            "GET",
            base_url,
            "/api/products/filter",
            token,
            params=params,
        )
        show_response(resp, body)

    st.subheader("Create Product (ADMIN)")
    default_product = {
        "productName": "Sample Product",
        "productDescription": "Basic description",
        "sku": "SKU-001",
        "picture": "https://example.com/image.jpg",
        "basePrice": 9.99,
        "stockQty": 10,
        "categoryId": 1,
    }
    product_text = st.text_area(
        "Product JSON",
        value=json.dumps(default_product, indent=2),
        height=200,
    )
    if st.button("Create Product"):
        payload, error = parse_json(product_text)
        if error:
            st.error(error)
        else:
            resp, body = call_api("POST", base_url, "/api/products", token, payload=payload)
            show_response(resp, body)

    st.caption("Quick validation check (requires admin token)")
    invalid_product = {"productName": "", "basePrice": -10, "sku": "", "categoryId": None}
    if st.button("Send Invalid Product"):
        resp, body = call_api("POST", base_url, "/api/products", token, payload=invalid_product)
        show_response(resp, body)

with tabs[3]:
    st.subheader("List Categories")
    if st.button("Get All Categories"):
        resp, body = call_api("GET", base_url, "/api/categories", token)
        show_response(resp, body)

    st.subheader("Create Category (ADMIN)")
    default_category = {
        "name": "Sample Category",
        "description": "Category description",
        "picture": "https://example.com/cat.jpg",
    }
    category_text = st.text_area(
        "Category JSON",
        value=json.dumps(default_category, indent=2),
        height=160,
    )
    if st.button("Create Category"):
        payload, error = parse_json(category_text)
        if error:
            st.error(error)
        else:
            resp, body = call_api("POST", base_url, "/api/categories", token, payload=payload)
            show_response(resp, body)

with tabs[4]:
    st.subheader("Get Cart (User)")
    if st.button("Get Cart"):
        resp, body = call_api("GET", base_url, "/api/cart", token)
        show_response(resp, body)

    st.subheader("Add to Cart (User)")
    default_cart = {"productId": 1, "qty": 1}
    cart_text = st.text_area(
        "AddToCart JSON",
        value=json.dumps(default_cart, indent=2),
        height=120,
    )
    if st.button("Add Item"):
        payload, error = parse_json(cart_text)
        if error:
            st.error(error)
        else:
            resp, body = call_api("POST", base_url, "/api/cart/add", token, payload=payload)
            show_response(resp, body)

    st.subheader("Remove from Cart (User)")
    remove_id = st.text_input("Product ID to remove", key="remove_id")
    if st.button("Remove Item"):
        resp, body = call_api(
            "DELETE",
            base_url,
            f"/api/cart/remove/{remove_id}",
            token,
        )
        show_response(resp, body)

with tabs[5]:
    st.subheader("Checkout (User)")
    if st.button("Checkout"):
        resp, body = call_api("POST", base_url, "/api/orders/checkout", token)
        show_response(resp, body)

    st.subheader("My Orders (User)")
    if st.button("Get My Orders"):
        resp, body = call_api("GET", base_url, "/api/orders/my", token)
        show_response(resp, body)

    st.subheader("All Orders (ADMIN)")
    if st.button("Get All Orders"):
        resp, body = call_api("GET", base_url, "/api/orders/all", token)
        show_response(resp, body)

    st.subheader("Update Order Status (ADMIN)")
    order_id = st.text_input("Order ID", key="order_id")
    order_status = st.text_input("Status (e.g. PENDING, SHIPPED)", key="order_status")
    if st.button("Update Status"):
        resp, body = call_api(
            "PUT",
            base_url,
            f"/api/orders/{order_id}/status",
            token,
            params={"status": order_status},
        )
        show_response(resp, body)

with tabs[6]:
    st.subheader("Pay for Order (Mock)")
    pay_order_id = st.text_input("Order ID to pay", key="pay_order_id")
    pay_mode = st.selectbox("Payment Mode", ["CARD", "UPI", "COD"], index=0)
    if st.button("Pay Order"):
        try:
            order_id_val = int(pay_order_id)
        except ValueError:
            st.error("Order ID must be a number")
        else:
            payload = {"orderId": order_id_val, "paymentMode": pay_mode}
            resp, body = call_api("POST", base_url, "/api/payments", token, payload=payload)
            show_response(resp, body)

with tabs[7]:
    st.subheader("Get Reviews")
    reviews_product_id = st.text_input("Product ID", key="reviews_product_id")
    if st.button("Get Reviews"):
        resp, body = call_api(
            "GET",
            base_url,
            f"/api/reviews/{reviews_product_id}",
            token,
        )
        show_response(resp, body)

    st.subheader("Add Review (User)")
    default_review = {"productId": 1, "rating": 5, "comment": "Great product"}
    review_text = st.text_area(
        "Review JSON",
        value=json.dumps(default_review, indent=2),
        height=140,
    )
    if st.button("Add Review"):
        payload, error = parse_json(review_text)
        if error:
            st.error(error)
        else:
            resp, body = call_api("POST", base_url, "/api/reviews", token, payload=payload)
            show_response(resp, body)

with tabs[8]:
    st.subheader("Raw Request")
    method = st.selectbox("Method", ["GET", "POST", "PUT", "DELETE"], index=0)
    path = st.text_input("Path", value="/api/products")
    params_text = st.text_area("Query Params JSON", value="{}", height=80)
    body_text = st.text_area("Body JSON", value="{}", height=120)
    if st.button("Send Request"):
        params, params_error = parse_json(params_text)
        payload, body_error = parse_json(body_text)
        if params_error:
            st.error(params_error)
        elif body_error:
            st.error(body_error)
        else:
            resp, body = call_api(
                method,
                base_url,
                path,
                token,
                params=params or None,
                payload=payload if method in {"POST", "PUT"} else None,
            )
            show_response(resp, body)
