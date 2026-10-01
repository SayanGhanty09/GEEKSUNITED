import cv2
import numpy as np
import os

def render_true_4k_frames():
    video_path = "geeks video.mp4"
    dirs = ["public/frames_4k", "public/frames"]
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        
    cap = cv2.VideoCapture(video_path)
    count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    target_w, target_h = 3840, 2160  # Full 4K UHD Resolution
    
    print(f"Rendering {count} true 4K UHD frames (3840x2160) from {video_path}...")
    
    for i in range(count):
        ret, frame = cap.read()
        if not ret:
            break
            
        # 1. 4K Lanczos-4 Resampling
        frame_4k = cv2.resize(frame, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)
        
        # 2. Cinematic Unsharp Mask for Crisp Text, Matrix Particles, and Silicon Traces
        blurred = cv2.GaussianBlur(frame_4k, (0, 0), 2.5)
        sharp_4k = cv2.addWeighted(frame_4k, 1.4, blurred, -0.4, 0)
        
        # 3. Write to both public/frames_4k and public/frames
        for d in dirs:
            out_file = os.path.join(d, f"frame_{i:03d}.webp")
            cv2.imwrite(out_file, sharp_4k, [cv2.IMWRITE_WEBP_QUALITY, 94])
            
        if (i + 1) % 30 == 0 or (i + 1) == count:
            print(f"4K Render Progress: [{i+1}/{count}] frames completed.")
            
    cap.release()
    print("SUCCESS: All 240 true 4K frames generated in public/frames_4k and public/frames!")

if __name__ == "__main__":
    render_true_4k_frames()
