import cv2
import os
from concurrent.futures import ThreadPoolExecutor

def process_frame(args):
    idx, frame_data, target_w, target_h, dirs = args
    # High-quality Lanczos-4 upscaling to 2560x1440 (Ultra-sharp 2K/QHD)
    upscaled = cv2.resize(frame_data, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)
    # Unsharp mask for crisp matrix characters and circuits
    blurred = cv2.GaussianBlur(upscaled, (0, 0), 2.0)
    sharp = cv2.addWeighted(upscaled, 1.3, blurred, -0.3, 0)
    
    for d in dirs:
        out_file = os.path.join(d, f"frame_{idx:03d}.webp")
        cv2.imwrite(out_file, sharp, [cv2.IMWRITE_WEBP_QUALITY, 92])

def run():
    video_path = "gemini_generated_video_968e28fa.mp4"
    dirs = ["public/frames", "public/frames_4k"]
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        
    cap = cv2.VideoCapture(video_path)
    count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Reading {count} frames from {video_path}...")
    
    frames = []
    for i in range(count):
        ret, frame = cap.read()
        if not ret:
            break
        frames.append((i, frame, 2560, 1440, dirs))
    cap.release()
    
    print(f"Parallel upscaling {len(frames)} frames across CPU threads...")
    with ThreadPoolExecutor(max_workers=8) as executor:
        list(executor.map(process_frame, frames))
        
    print(f"SUCCESS: Extracted all {len(frames)} frames into public/frames and public/frames_4k!")

if __name__ == "__main__":
    run()
