# -*- coding: utf-8 -*-
"""
LS Cable & System · AI Work Way Quest 오프닝 영상 빌드
(moviepy 2.1 기반, krafton-way 패턴 차용 + LS 톤 적용)
"""
import os, sys, json, base64, time, math, struct, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).parent
SCENES = ROOT / "scenes"
AUDIO = ROOT / "audio"
OUT = ROOT / "output"
OUT.mkdir(exist_ok=True)

# .env.local 로드 (BOM 안전)
env_local = ROOT.parent / ".env.local"
if env_local.exists():
    raw = env_local.read_bytes().decode("utf-8-sig", errors="ignore")
    for line in raw.splitlines():
        if line.startswith("GEMINI_API_KEY="):
            os.environ["GEMINI_API_KEY"] = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY 미설정"); sys.exit(1)

# ============================================================
# LS AI Work Way Quest 오프닝 영상 시나리오 (1분 30초)
# ============================================================
SCENES_DEF = [
    {"img":"scene-01-city-dawn.jpeg",       "dur":5.0, "narr":"새로운 시대가 열리고 있습니다.", "voice":"Charon"},
    {"img":"scene-02-office-reflect.jpeg",  "dur":4.5, "narr":"LS Cable & System은 함께 8개의 AI Work Way를 약속했습니다.", "voice":"Charon"},
    {"img":"scene-03-hero.jpeg",            "dur":4.5, "narr":"그러나 일상의 순간, 진짜로 손가락이 기억하나요?", "voice":"Aoede"},
    {"img":"scene-04-q1.jpg",               "dur":3.0, "narr":"Quest 1, 단순 반복을 넘어 몰입으로.", "voice":"Charon"},
    {"img":"scene-05-q2.jpg",               "dur":3.0, "narr":"Quest 2, 경험을 더해 가치를 완성한다.", "voice":"Charon"},
    {"img":"scene-06-q3.jpg",               "dur":3.0, "narr":"Quest 3, Agile하게 도전한다.", "voice":"Charon"},
    {"img":"scene-07-q4.jpg",               "dur":3.0, "narr":"Quest 4, 상세한 지시가 압도적 차이를 만든다.", "voice":"Charon"},
    {"img":"scene-08-q5.jpg",               "dur":3.0, "narr":"Quest 5, AI로 가속하고 사람이 마침표를 찍는다.", "voice":"Charon"},
    {"img":"scene-09-constellation.jpeg",   "dur":4.0, "narr":"", "voice":"Charon"},
    {"img":"scene-10-q6.jpg",               "dur":3.0, "narr":"Quest 6, 개인기가 아닌 조직의 힘으로.", "voice":"Charon"},
    {"img":"scene-11-q7.jpg",               "dur":3.0, "narr":"Quest 7, 데이터의 생명은 정확한 출처에서.", "voice":"Charon"},
    {"img":"scene-12-q8.jpg",               "dur":3.5, "narr":"Quest 8, 결과물의 최종 책임자는 나다.", "voice":"Charon"},
    {"img":"scene-13-final.jpg",            "dur":5.5, "narr":"마지막에는 8 Way를 통합한 한 페이지 보고서가 기다립니다.", "voice":"Aoede"},
    {"img":"scene-16-victory.jpeg",         "dur":6.0, "narr":"2.5시간 후, 손가락이 AI Work Way를 기억합니다. LS Cable & System AI Work Way Quest.", "voice":"Charon"},
]

def gemini_tts(text, voice="Charon", out_path=None):
    print(f"  🎙️ TTS [{voice}]: '{text[:30]}...'")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key={API_KEY}"
    body = {
        "contents": [{"parts": [{"text": text}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}
        }
    }
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                  headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            j = json.loads(r.read())
        inline = j.get("candidates",[{}])[0].get("content",{}).get("parts",[{}])[0].get("inlineData")
        if not inline or not inline.get("data"):
            print("    ⚠ TTS 응답에 오디오 없음"); return None
        pcm = base64.b64decode(inline["data"])
        wav = build_wav(pcm, sample_rate=24000)
        if out_path:
            Path(out_path).write_bytes(wav)
            print(f"    ✓ 저장: {out_path} ({len(wav)/1024:.1f} KB)")
            return out_path
        return wav
    except Exception as e:
        print(f"    ✗ {type(e).__name__}: {e}"); return None

def build_wav(pcm, sample_rate=24000):
    nch=1; bits=16
    byte_rate=sample_rate*nch*bits//8
    block_align=nch*bits//8
    data_size=len(pcm)
    h=b"RIFF"+struct.pack("<I",36+data_size)+b"WAVE"
    h+=b"fmt "+struct.pack("<IHHIIHH",16,1,nch,sample_rate,byte_rate,block_align,bits)
    h+=b"data"+struct.pack("<I",data_size)
    return h+pcm

def gen_all_tts():
    print("=== STEP 1 · 한국어 TTS 내레이션 생성 ===")
    AUDIO.mkdir(exist_ok=True)
    for i, sc in enumerate(SCENES_DEF, 1):
        out = AUDIO / f"narr-{i:02d}.wav"
        if not sc["narr"]:
            print(f"  Scene {i:02d}: (무음)"); continue
        if out.exists() and out.stat().st_size > 1000:
            print(f"  Scene {i:02d}: (캐시) {out.name}"); continue
        gemini_tts(sc["narr"], voice=sc.get("voice","Charon"), out_path=str(out))
        time.sleep(0.4)
    print("✓ TTS 생성 완료\n")

def build_video():
    print("=== STEP 2 · 영상 합성 (moviepy 2.1) ===")
    from moviepy import (
        ImageClip, AudioFileClip, CompositeVideoClip,
        concatenate_videoclips, TextClip, ColorClip, CompositeAudioClip,
        concatenate_audioclips,
    )
    from moviepy.video.fx import FadeIn, FadeOut, Resize, Crop
    from moviepy.audio.fx import AudioFadeIn, AudioFadeOut, MultiplyVolume

    W, H = 1920, 1080
    clips = []
    audio_clips = []
    cursor = 0.0

    for i, sc in enumerate(SCENES_DEF, 1):
        img_path = SCENES / sc["img"]
        if not img_path.exists():
            print(f"  ⚠ 이미지 없음: {img_path.name}")
            clip = ColorClip(size=(W,H), color=(10,30,61), duration=sc["dur"])
        else:
            ic = ImageClip(str(img_path))
            ratio_w = W / ic.w
            ratio_h = H / ic.h
            scale = max(ratio_w, ratio_h) * 1.05
            ic = ic.with_effects([Resize(new_size=(int(ic.w*scale), int(ic.h*scale)))])
            cx = ic.w / 2
            cy = ic.h / 2
            ic = ic.with_effects([Crop(x_center=cx, y_center=cy, width=W, height=H)])
            ic = ic.with_duration(sc["dur"])
            ic = ic.with_effects([FadeIn(0.3), FadeOut(0.3)])
            clip = ic

        if sc["narr"]:
            try:
                txt = TextClip(
                    text=sc["narr"], font_size=44, color="white",
                    method="caption", size=(int(W*0.85), None),
                    text_align="center",
                    stroke_color="black", stroke_width=2,
                ).with_duration(sc["dur"]).with_position(("center", int(H*0.78)))
                clip = CompositeVideoClip([clip, txt])
            except Exception as e:
                print(f"  ⚠ 자막 실패 (계속 진행): {e}")

        narr_path = AUDIO / f"narr-{i:02d}.wav"
        if narr_path.exists() and narr_path.stat().st_size > 1000:
            try:
                a = AudioFileClip(str(narr_path)).with_start(cursor)
                from moviepy.audio.fx import MultiplySpeed
                a = a.with_effects([MultiplySpeed(1.15)])
                audio_clips.append(a)
            except Exception as e:
                print(f"  ⚠ 내레이션 로드 실패: {e}")

        cursor += sc["dur"]
        clips.append(clip)

    video = concatenate_videoclips(clips, method="compose")
    total_dur = video.duration
    print(f"  · 총 길이: {total_dur:.1f}초")

    bgm_path = AUDIO / "bgm.mp3"
    if bgm_path.exists():
        bgm = AudioFileClip(str(bgm_path)).with_effects([MultiplyVolume(0.18)])
        if bgm.duration < total_dur:
            n = int(math.ceil(total_dur / bgm.duration))
            bgm = concatenate_audioclips([bgm] * n)
        bgm = bgm.subclipped(0, total_dur).with_effects([AudioFadeIn(1.0), AudioFadeOut(1.5)])
        audio_clips.append(bgm)
        print("  · BGM 적용 (볼륨 0.18)")

    if audio_clips:
        final_audio = CompositeAudioClip(audio_clips)
        video = video.with_audio(final_audio)

    out_path = OUT / "ls-aiway-quest-opening.mp4"
    print(f"  · 렌더링: {out_path}")
    video.write_videofile(
        str(out_path), fps=30, codec="libx264", audio_codec="aac",
        bitrate="5500k", threads=4, preset="medium",
    )
    print(f"\n✅ 영상 완성: {out_path}")
    print(f"   파일 크기: {out_path.stat().st_size/1024/1024:.1f} MB")

if __name__ == "__main__":
    gen_all_tts()
    build_video()
