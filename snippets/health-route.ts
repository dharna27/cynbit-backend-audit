# https://www.cynbit.in/.well-known/security.txt
Contact: mailto:security@cynbit.in
Expires: 2027-12-31T00:00:00.000Z
Preferred-Languages: en
# expiring signed link for candidates
import hmac, hashlib, time, base64, os
SECRET = os.environ["LINK_SIGNING_KEY"].encode()
def make_token(candidate_id: str, ttl_seconds: int = 72 * 3600) -> str:
 expires = int(time.time()) + ttl_seconds
    msg = f"{candidate_id}.{expires}".encode()
    sig = hmac.new(SECRET, msg, hashlib.sha256).digest()
    return base64.urlsafe_b64encode(msg + b"." + sig).decode()
def check_token(token: str):
    raw = base64.urlsafe_b64decode(token.encode())
    msg, _, sig = raw.rpartition(b".")
    expected = hmac.new(SECRET, msg, hashlib.sha256).digest()
    if not hmac.compare_digest(sig, expected):
        return None
    candidate_id, expires = msg.decode().split(".")
    return candidate_id if int(expires) > time.time() else None
