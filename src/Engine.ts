import * as ROT from 'rot-js';

export class Engine {
    public static readonly WIDTH = 80;
    public static readonly HEIGHT = 50;
  
  private _rotX : number;
  public get RotX() : number {
      return this._rotX;
  }
  public set RotX(v : number) {
      this._rotX = v;
  }
  
  private _rotY : number;
  public get RotY() : number {
      return this._rotY;
  }
  public set RotY(v : number) {
      this._rotY = v;
  }
  
    display: ROT.Display;
  
    constructor() {
      this.display = new ROT.Display({width: Engine.WIDTH, height: Engine.HEIGHT});
      this.RotX = 100;
      this.RotY = 100;
    }
  
    render() {
      var _rotX = Engine.WIDTH / 2;
      var _rotY = Engine.HEIGHT / 2;
      this.display.draw(_rotX, _rotY, 'Hello World', '#fff', '#000');
      _rotX = this.RotX;
      _rotY = this.RotY;
    }

  }