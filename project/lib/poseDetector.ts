import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

export interface PoseMove {
  raise_left_hand: number;
  raise_right_hand: number;
  squat: number;
  jump: number;
  clap: number;
}

export interface PoseDetectionResult {
  moves: PoseMove;
  landmarks?: any[];
  worldLandmarks?: any[];
}

export class PoseDetector {
  private poseLandmarker: PoseLandmarker | null = null;
  private isInitialized = false;
  private lastHipY = 0;
  private jumpVelocityThreshold = 0.05;
  private frameCount = 0;

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );

      this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numPoses: 1
      });

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize pose detector:', error);
      return false;
    }
  }

  detectPose(videoElement: HTMLVideoElement): PoseDetectionResult {
    if (!this.poseLandmarker || !this.isInitialized) {
      return { moves: this.getEmptyMoves() };
    }

    try {
      this.frameCount++;
      const results = this.poseLandmarker.detectForVideo(videoElement, performance.now());
      
      if (!results.landmarks || results.landmarks.length === 0) {
        return { moves: this.getEmptyMoves() };
      }

      const landmarks = results.landmarks[0];
      const moves = this.analyzeMoves(landmarks);

      return {
        moves,
        landmarks: results.landmarks,
        worldLandmarks: results.worldLandmarks
      };
    } catch (error) {
      console.error('Pose detection error:', error);
      return { moves: this.getEmptyMoves() };
    }
  }

  private getEmptyMoves(): PoseMove {
    return {
      raise_left_hand: 0,
      raise_right_hand: 0,
      squat: 0,
      jump: 0,
      clap: 0
    };
  }

  private analyzeMoves(landmarks: any[]): PoseMove {
    const moves = this.getEmptyMoves();

    // MediaPipe pose landmark indices
    const POSE_LANDMARKS = {
      LEFT_SHOULDER: 11,
      RIGHT_SHOULDER: 12,
      LEFT_ELBOW: 13,
      RIGHT_ELBOW: 14,
      LEFT_WRIST: 15,
      RIGHT_WRIST: 16,
      LEFT_HIP: 23,
      RIGHT_HIP: 24,
      LEFT_KNEE: 25,
      RIGHT_KNEE: 26,
      LEFT_ANKLE: 27,
      RIGHT_ANKLE: 28
    };

    // Get key landmarks
    const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
    const rightWrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];
    const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const leftKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const rightKnee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
    const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const rightAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

    // 1. Detect hand raises
    if (leftWrist && leftShoulder) {
      const handRaiseMargin = 0.1; // 10% above shoulder
      if (leftWrist.y < leftShoulder.y - handRaiseMargin) {
        moves.raise_left_hand = 1;
      }
    }

    if (rightWrist && rightShoulder) {
      const handRaiseMargin = 0.1;
      if (rightWrist.y < rightShoulder.y - handRaiseMargin) {
        moves.raise_right_hand = 1;
      }
    }

    // 2. Detect squat (knee angle)
    if (leftHip && leftKnee && leftAnkle && rightHip && rightKnee && rightAnkle) {
      const leftKneeAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
      const rightKneeAngle = this.calculateAngle(rightHip, rightKnee, rightAnkle);
      
      const squatThreshold = 95; // degrees
      if (leftKneeAngle < squatThreshold && rightKneeAngle < squatThreshold) {
        moves.squat = 1;
      }
    }

    // 3. Detect jump (hip velocity or feet off ground)
    if (leftHip && rightHip) {
      const currentHipY = (leftHip.y + rightHip.y) / 2;
      
      if (this.frameCount > 1) {
        const hipVelocity = this.lastHipY - currentHipY; // Negative means moving up
        if (hipVelocity > this.jumpVelocityThreshold) {
          moves.jump = 1;
        }
      }
      
      this.lastHipY = currentHipY;
    }

    // Alternative jump detection: both feet off ground (high hip position)
    if (leftHip && rightHip && leftAnkle && rightAnkle) {
      const hipY = (leftHip.y + rightHip.y) / 2;
      const ankleY = (leftAnkle.y + rightAnkle.y) / 2;
      const hipToAnkleDistance = ankleY - hipY;
      
      // If hip-to-ankle distance is unusually small, person might be jumping
      if (hipToAnkleDistance < 0.3) { // Normalized coordinates
        moves.jump = 1;
      }
    }

    // 4. Detect clap (wrists close together at chest height)
    if (leftWrist && rightWrist && leftShoulder && rightShoulder) {
      const wristDistance = Math.sqrt(
        Math.pow(leftWrist.x - rightWrist.x, 2) + 
        Math.pow(leftWrist.y - rightWrist.y, 2)
      );
      
      const chestY = (leftShoulder.y + rightShoulder.y) / 2;
      const wristY = (leftWrist.y + rightWrist.y) / 2;
      
      const clapDistanceThreshold = 0.08;
      const chestHeightTolerance = 0.15;
      
      if (wristDistance < clapDistanceThreshold && 
          Math.abs(wristY - chestY) < chestHeightTolerance) {
        moves.clap = 1;
      }
    }

    return moves;
  }

  private calculateAngle(point1: any, point2: any, point3: any): number {
    // Calculate angle at point2 between point1-point2-point3
    const vector1 = {
      x: point1.x - point2.x,
      y: point1.y - point2.y
    };
    
    const vector2 = {
      x: point3.x - point2.x,
      y: point3.y - point2.y
    };
    
    const dot = vector1.x * vector2.x + vector1.y * vector2.y;
    const mag1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
    const mag2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
    
    const cosAngle = dot / (mag1 * mag2);
    const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
    
    return angle * (180 / Math.PI);
  }

  drawLandmarks(
    canvas: HTMLCanvasElement, 
    landmarks: any[], 
    canvasWidth: number, 
    canvasHeight: number
  ): void {
    if (!landmarks || landmarks.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw pose connections
    const connections = [
      [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Arms
      [11, 23], [12, 24], [23, 24], // Torso
      [23, 25], [25, 27], [24, 26], [26, 28] // Legs
    ];

    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;

    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];
      
      if (startPoint && endPoint) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x * canvasWidth, startPoint.y * canvasHeight);
        ctx.lineTo(endPoint.x * canvasWidth, endPoint.y * canvasHeight);
        ctx.stroke();
      }
    });

    // Draw landmarks
    ctx.fillStyle = '#ff0000';
    landmarks.forEach((landmark) => {
      if (landmark) {
        ctx.beginPath();
        ctx.arc(
          landmark.x * canvasWidth, 
          landmark.y * canvasHeight, 
          3, 
          0, 
          2 * Math.PI
        );
        ctx.fill();
      }
    });
  }

  cleanup(): void {
    if (this.poseLandmarker) {
      this.poseLandmarker.close();
      this.poseLandmarker = null;
    }
    this.isInitialized = false;
  }
}