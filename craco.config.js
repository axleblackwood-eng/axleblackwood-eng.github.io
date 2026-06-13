"""Iteration 2 backend tests: profile, account deletion, alter detail, avatar upload, files, friend email, supporting, share system_bio."""
import io
import os
import pytest
import requests

BASE = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
TOK_A = "test_session_A_1781370472275"
TOK_B = "test_session_B_1781370472275"
EMAIL_A = "test.userA.1781370472275@example.com"
EMAIL_B = "test.userB.1781370472275@example.com"

HA = {"Authorization": f"Bearer {TOK_A}"}
HB = {"Authorization": f"Bearer {TOK_B}"}
HAJ = {**HA, "Content-Type": "application/json"}
HBJ = {**HB, "Content-Type": "application/json"}


@pytest.fixture(scope="module")
def state():
    return {}


# ---- Profile / Account ----
def test_profile_update_and_me(state):
    payload = {
        "display_name": "TEST_DisplayA",
        "system_name": "TEST_SystemA",
        "pronouns": "they/them",
        "bio": "**hello world**",
    }
    r = requests.put(f"{BASE}/api/profile", json=payload, headers=HAJ)
    assert r.status_code == 200, r.text
    body = r.json()
    for k, v in payload.items():
        assert body[k] == v, f"{k}: {body[k]} != {v}"

    r2 = requests.get(f"{BASE}/api/auth/me", headers=HA)
    assert r2.status_code == 200
    me = r2.json()
    for k, v in payload.items():
        assert me[k] == v


# ---- Alter detail ----
def test_alter_detail(state):
    # create alter
    r = requests.post(f"{BASE}/api/alters", json={"name": "TEST_DetailAlter", "pronouns": "she/her", "color": "#A96F5D", "description": "# header\nmd body"}, headers=HAJ)
    assert r.status_code == 200, r.text
    aid = r.json()["id"]
    state["aid"] = aid

    # add fronting + journal
    requests.post(f"{BASE}/api/fronting/switch", json={"alter_id": aid, "note": "n"}, headers=HAJ)
    requests.post(f"{BASE}/api/journal", json={"title": "TEST_j", "body": "b", "alter_id": aid}, headers=HAJ)

    r = requests.get(f"{BASE}/api/alters/{aid}", headers=HA)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "alter" in data and data["alter"]["id"] == aid
    assert "fronting" in data and isinstance(data["fronting"], list)
    assert "journal" in data and isinstance(data["journal"], list)
    assert len(data["journal"]) >= 1


def test_alter_detail_404():
    r = requests.get(f"{BASE}/api/alters/nonexistent_xxx", headers=HA)
    assert r.status_code == 404


# ---- Avatar upload + serve ----
def test_avatar_upload_and_serve(state):
    # 1x1 PNG bytes
    png = bytes.fromhex(
        "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C489"
        "0000000A49444154789C6300010000000500010D0A2DB40000000049454E44AE426082"
    )
    files = {"file": ("avatar.png", io.BytesIO(png), "image/png")}
    r = requests.post(f"{BASE}/api/upload/avatar", files=files, headers=HA)
    assert r.status_code == 200, r.text
    body = r.json()
    assert "path" in body and "url" in body
    assert body["url"].startswith("/api/files/")
    state["avatar_path"] = body["path"]
    state["avatar_url"] = body["url"]

    # Fetch it
    r2 = requests.get(f"{BASE}{body['url']}")
    assert r2.status_code == 200, r2.text
    assert r2.headers.get("content-type", "").startswith("image/")
    assert len(r2.content) > 0


def test_avatar_reject_non_image():
    files = {"file": ("a.txt", io.BytesIO(b"not an image"), "text/plain")}
    r = requests.post(f"{BASE}/api/upload/avatar", files=files, headers=HA)
    assert r.status_code == 400


def test_file_404():
    r = requests.get(f"{BASE}/api/files/pluralhaven/avatars/none/missing.png")
    assert r.status_code == 404


# ---- Friend email + Supporting ----
def test_friend_email_persists_and_supporting(state):
    # User A creates a friend bucket invited to User B by email
    payload = {
        "name": "TEST_FriendB",
        "email": EMAIL_B,
        "note": "best friend",
        "can_see_alter_ids": [state["aid"]],
        "show_current_fronter": True,
        "show_pronouns": True,
        "show_roles": True,
        "show_descriptions": True,
        "show_journal": False,
    }
    r = requests.post(f"{BASE}/api/friends", json=payload, headers=HAJ)
    assert r.status_code == 200
    f = r.json()
    assert f.get("email") == EMAIL_B
    state["friend_id"] = f["id"]
    state["share_token"] = f["share_token"]

    # User B should see this in /api/supporting
    r2 = requests.get(f"{BASE}/api/supporting", headers=HB)
    assert r2.status_code == 200
    items = r2.json()
    assert isinstance(items, list)
    assert any(it["share_token"] == f["share_token"] for it in items), items
    # validate fields
    match = next(it for it in items if it["share_token"] == f["share_token"])
    assert match["system_name"] == "Test User A"
    assert "id" in match

    # PUT (update) preserves email
    payload2 = {**payload, "note": "updated note"}
    r3 = requests.put(f"{BASE}/api/friends/{state['friend_id']}", json=payload2, headers=HAJ)
    assert r3.status_code == 200
    assert r3.json()["email"] == EMAIL_B


def test_supporting_empty_for_user_a():
    r = requests.get(f"{BASE}/api/supporting", headers=HA)
    assert r.status_code == 200
    # User A has no friends inviting them by email
    items = r.json()
    assert all(it["system_name"] != "Test User A" for it in items)


# ---- Share includes system_bio ----
def test_share_includes_system_bio(state):
    # User A set bio earlier via profile update
    r = requests.get(f"{BASE}/api/share/{state['share_token']}")
    assert r.status_code == 200
    body = r.json()
    assert "system_bio" in body
    assert body["system_bio"] == "**hello world**"
    assert body["system_name"] == "TEST_SystemA"


# ---- Account deletion (test User B since A is used by other tests) ----
def test_delete_account_user_b():
    # First create some data for user B
    r = requests.post(f"{BASE}/api/alters", json={"name": "TEST_BAlter"}, headers=HBJ)
    assert r.status_code == 200

    # delete account
    r = requests.delete(f"{BASE}/api/account", headers=HB)
    assert r.status_code == 200
    assert r.json().get("ok") is True

    # subsequent auth should fail
    r2 = requests.get(f"{BASE}/api/auth/me", headers=HB)
    assert r2.status_code == 401


# ---- Cleanup ----
def test_cleanup(state):
    if state.get("friend_id"):
        requests.delete(f"{BASE}/api/friends/{state['friend_id']}", headers=HA)
    if state.get("aid"):
        requests.delete(f"{BASE}/api/alters/{state['aid']}", headers=HA)
