import uuid
import random
import string
from datetime import datetime, timezone


def generate_reference_id() -> str:
    date_part = datetime.now(timezone.utc).strftime("%Y%m%d")
    random_part = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"CSD-{date_part}-{random_part}"


def generate_idempotency_key() -> str:
    return str(uuid.uuid4())
