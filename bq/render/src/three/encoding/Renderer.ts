import { getOr } from 'lodash/fp'
import gl from 'gl'
import {
  WebGL1Renderer,
  PCFSoftShadowMap,
  WebGLRenderTarget,
  LinearFilter,
  NearestFilter,
  RGBAFormat,
  UnsignedByteType,
  Color,
} from 'three'

export class Renderer {
  private _renderer: WebGL1Renderer | undefined
  private _renderTarget: WebGLRenderTarget | undefined

  private _canvas: HTMLCanvasElement | undefined

  constructor(width = 400, height = 300) {
    this._canvas = {
      width: width,
      height: height,
      addEventListener: (event: any) => {
        // ok
      },
      removeEventListener: (event: any) => {
        // ok
      },
      getContext: (contextType: any, attributes: any) => {
        return getOr(null, contextType, {
          webgl: gl(width, height, {
            preserveDrawingBuffer: true,
          }),
        })
      },
    } as unknown as HTMLCanvasElement

    this._renderer = new WebGL1Renderer({
      canvas: this._canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
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

  public getRenderer = (): WebGL1Renderer => {
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
