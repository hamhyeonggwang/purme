export interface CameraConfig {
  facingMode?: 'user' | 'environment'
  width?: number
  height?: number
}

export interface CameraResult {
  success: boolean
  dataUrl?: string
  error?: string
}

export class CameraManager {
  private stream: MediaStream | null = null
  private videoElement: HTMLVideoElement | null = null

  async initializeCamera(
    videoElement: HTMLVideoElement,
    config: CameraConfig = {}
  ): Promise<boolean> {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: config.facingMode || 'user',
          width: config.width || 640,
          height: config.height || 480
        }
      }

      this.stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.videoElement = videoElement
      videoElement.srcObject = this.stream
      
      return new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          videoElement.play()
          resolve(true)
        }
      })
    } catch (error) {
      console.error('카메라 초기화 실패:', error)
      return false
    }
  }

  async capturePhoto(): Promise<CameraResult> {
    if (!this.videoElement) {
      return { success: false, error: '카메라가 초기화되지 않았습니다' }
    }

    try {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      
      if (!context) {
        return { success: false, error: '캔버스 컨텍스트를 가져올 수 없습니다' }
      }

      canvas.width = this.videoElement.videoWidth
      canvas.height = this.videoElement.videoHeight
      
      context.drawImage(this.videoElement, 0, 0)
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      
      return { success: true, dataUrl }
    } catch (error) {
      return { success: false, error: '사진 촬영에 실패했습니다' }
    }
  }

  async switchCamera(): Promise<boolean> {
    if (!this.stream) return false

    const currentFacingMode = this.stream.getVideoTracks()[0].getSettings().facingMode
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user'
    
    this.cleanup()
    
    return this.initializeCamera(this.videoElement!, { facingMode: newFacingMode })
  }

  cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
    
    if (this.videoElement) {
      this.videoElement.srcObject = null
    }
  }

  async uploadFallback(): Promise<CameraResult> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file) {
          resolve({ success: false, error: '파일을 선택하지 않았습니다' })
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({ success: true, dataUrl: e.target?.result as string })
        }
        reader.onerror = () => {
          resolve({ success: false, error: '파일 읽기에 실패했습니다' })
        }
        reader.readAsDataURL(file)
      }
      
      input.click()
    })
  }
}

export const cameraManager = new CameraManager()
