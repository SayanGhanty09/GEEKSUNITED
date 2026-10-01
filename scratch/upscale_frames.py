import cv2
import numpy as np
import os

def upscale_video_to_4k(video_path="geeks video.mp4", output_dir="public/frames", target_res=(2560, 1440)):
    os.makedirs(output_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Upscaling {count} frames from {video_path} to {target_res} with Lanczos-4 and Unsharp Mask...")

    for i in range(count):
        ret, frame = cap.read()
        if not ret:
            break
        
        # 1. High-quality Lanczos-4 Upscaling
        upscaled = cv2.resize(frame, target_res, interpolation=cv2.INTER_LANCZOS4)

        # 2. Unsharp Masking for Ultra-Crisp Circuit Lines & Matrix Details
        gaussian = cv2.GaussianBlur(upscaled, (0, 0), 2.0)
        sharpened = cv2.addWeighted(upscaled, 1.35, gaussian, -0.35, 0)

        # 3. Save as High-Quality WebP
        out_path = os.path.join(output_dir, f"frame_{i:03d}.webp")
        cv2.imwrite(out_path, sharpened, [cv2.IMWRITE_WEBP_QUALITY, 92])
        
        if (i + 1) % 30 == 0 or (i + 1) == count:
            print(f"Processed [{i+1}/{count}] frames...")

    cap.release()
    print("Done! All 4K frames successfully saved.")

if __name__ == "__main__":
    upscale_video_to_4k()
