import cv2
import os
from concurrent.futures import ThreadPoolExecutor

def process_frame(args):
    idx, frame_data, target_w, target_h, dirs = args
    frame_4k = cv2.resize(frame_data, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)
    blurred = cv2.GaussianBlur(frame_4k, (0, 0), 2.5)
    sharp_4k = cv2.addWeighted(frame_4k, 1.4, blurred, -0.4, 0)
    
    for d in dirs:
        out_file = os.path.join(d, f"frame_{idx:03d}.webp")
        cv2.imwrite(out_file, sharp_4k, [cv2.IMWRITE_WEBP_QUALITY, 94])

def fast_render_4k():
    video_path = "geeks video.mp4"
    dirs = ["public/frames_4k", "public/frames"]
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        
    cap = cv2.VideoCapture(video_path)
    count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Reading {count} raw video frames into memory...")
    
    frames = []
    for i in range(count):
        ret, frame = cap.read()
        if not ret:
            break
        frames.append((i, frame, 3840, 2160, dirs))
    cap.release()
    
    print(f"Parallel upscaling {len(frames)} frames across CPU threads...")
    with ThreadPoolExecutor(max_workers=8) as executor:
        list(executor.map(process_frame, frames))
        
    print(f"SUCCESS: All {count} true 4K UHD (3840x2160) frames generated in public/frames_4k and public/frames!")

if __name__ == "__main__":
    fast_render_4k()
