# -*- coding: utf-8 -*-
"""LS AI Work Way Quest 오프닝 영상 YouTube 업로드"""
import os, pickle, sys, time
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
VIDEO_FILE = "C:/Users/ksajh/.claude/브루마블/ls-aiway-quest/video/output/ls-aiway-quest-opening.mp4"
THUMBNAIL_FILE = "C:/Users/ksajh/.claude/브루마블/ls-aiway-quest/video/scenes/scene-03-hero.jpeg"
TOKEN_FILE = "C:/Users/ksajh/secrets/youtube_token.pickle"
CLIENT_SECRET = "C:/Users/ksajh/client_secret_1093341523453-p84gdjph7leumkcksv5sumeh32lb0ghd.apps.googleusercontent.com.json"

TITLE = "LS Cable & System — AI Work Way Quest · 오프닝"
DESCRIPTION = """함께 만든, 함께 지킬 LS의 AI Work Way.
8개 Quest로 손가락이 기억하게 만드는 2.5시간.

LS Cable & System 'AI를 활용 일하는 방식' 8개 행동약속 전사 내재화 교육
'AI Work Way Quest' 오프닝 영상.
2.5시간 1회 완결 · 8 Quest + FINAL BOSS · 개인전/팀전 선택 · 무제한 재도전 · Gemini AI 채점.

🌐 데모: https://ls-aiway-quest.vercel.app
📄 제안서: https://ls-aiway-quest.vercel.app/proposal

🎬 제작: JJ Creative 교육연구소
🎙 음성: Gemini 3.1 Flash TTS
🎨 비주얼: Gemini 3.1 Flash Image Preview · moviepy

#LSCableSystem #AIWorkWay #JJCreative #HRD #게이미피케이션"""

TAGS = ["LSCableSystem", "LS전선", "AIWorkWay", "기업교육", "HRD", "JJCreative",
        "Gemini", "AI", "내재화교육", "조직문화", "게이미피케이션"]
CATEGORY_ID = "27"
PRIVACY = "unlisted"  # 일부 공개 (링크 있는 사람만)

def get_service():
    creds = None
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "rb") as f:
            creds = pickle.load(f)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET, SCOPES)
            creds = flow.run_local_server(port=8765)
        os.makedirs(os.path.dirname(TOKEN_FILE), exist_ok=True)
        with open(TOKEN_FILE, "wb") as f:
            pickle.dump(creds, f)
    return build("youtube", "v3", credentials=creds)

def upload():
    if not os.path.exists(VIDEO_FILE):
        print(f"❌ 영상 없음: {VIDEO_FILE}"); sys.exit(1)
    print(f"📹 업로드: {VIDEO_FILE} ({os.path.getsize(VIDEO_FILE)/1024/1024:.1f} MB)")
    yt = get_service()
    body = {
        "snippet": {
            "title": TITLE,
            "description": DESCRIPTION,
            "tags": TAGS,
            "categoryId": CATEGORY_ID,
            "defaultLanguage": "ko",
            "defaultAudioLanguage": "ko",
        },
        "status": {
            "privacyStatus": PRIVACY,
            "selfDeclaredMadeForKids": False,
            "embeddable": True,
            "publicStatsViewable": True,
        },
    }
    media = MediaFileUpload(VIDEO_FILE, chunksize=8 * 1024 * 1024, resumable=True)
    req = yt.videos().insert(part=",".join(body.keys()), body=body, media_body=media)
    response = None
    while response is None:
        status, response = req.next_chunk()
        if status:
            print(f"   진행: {int(status.progress() * 100)}%")
    vid = response["id"]
    print(f"\n✅ 업로드 완료!")
    print(f"   Video ID: {vid}")
    print(f"   URL:      https://www.youtube.com/watch?v={vid}")
    print(f"   Embed:    https://www.youtube.com/embed/{vid}")
    if os.path.exists(THUMBNAIL_FILE):
        try:
            yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(THUMBNAIL_FILE)).execute()
            print(f"   ✓ 썸네일 적용")
        except Exception as e:
            print(f"   ⚠ 썸네일 실패: {e}")
    # Video ID를 텍스트 파일에 저장 (제안서 페이지 교체용)
    out_id = os.path.join(os.path.dirname(VIDEO_FILE), "..", "youtube_id.txt")
    with open(out_id, "w") as f:
        f.write(vid)
    print(f"\n📝 Video ID 저장: {out_id}")
    return vid

if __name__ == "__main__":
    upload()
