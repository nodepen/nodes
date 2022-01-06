import {
  WebGLRenderer,
  WebGLRenderTarget,
  PCFSoftShadowMap,
  LinearFilter,
  NearestFilter,
  RGBAFormat,
  UnsignedByteType,
  Color,
} from 'three'
import gl from 'gl'

export class Renderer {
  private _renderer: WebGLRenderer | undefined
  private _renderTarget: WebGLRenderTarget | undefined

  private _canvas: any | undefined

  constructor(width = 400, height = 300) {
    this._canvas = {
      width,
      height,
      addEventListener: () => {
        /* ok */
      },
      removeEventListener: () => {
        /* ok */
      },
    }

    this._renderer = new WebGLRenderer({
      canvas: this._canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      context: gl(width, height, {
        preserveDrawingBuffer: true,
      }),
    })

    this._renderer.shadowMap.enabled = true
    this._renderer.shadowMap.type = PCFSoftShadowMap

    this._renderTarget = new WebGLRenderTarget(width, height, {
      minFilter: LinearFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: UnsignedByteType,
    })

    this._renderer.setRenderTarget(this._renderTarget)
    this._renderer.setClearColor(new Color(0xeff2f2))
  }

  public getRenderer = (): WebGLRenderer => {
    if (!this._renderer) {
      throw new Error('No renderer!')
    }
    return this._renderer
  }

  public destroy = (): void => {
    delete this._renderer
    delete this._renderTarget
    delete this._canvas
  }
}
