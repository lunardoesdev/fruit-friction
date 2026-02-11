import * as ex from "excalibur";

const engine = new ex.Engine({
  // backgroundColor: new ex.Color(0, 100, 0),
  physics: {
    gravity: ex.vec(0, 500),
    enabled: true,
  },
});

await engine.start();

class Sphere extends ex.Actor {
  constructor(radius: number) {
    super({
      pos: ex.vec(engine.halfDrawWidth, 25),
      color: new ex.Color(255, 0, 0),
      collisionType: ex.CollisionType.Active,
    });
    this.collider.useCircleCollider(radius);
    this.graphics.use(
      new ex.Circle({
        radius: radius,
      }),
    );

    this.color = new ex.Color(255, 0, 0);
  }
}

const sphere = new Sphere(42);

const floorHeight = 10;
const floor = new ex.Actor({
  pos: ex.vec(engine.halfDrawWidth, engine.drawHeight - floorHeight / 2),
  height: floorHeight,
  width: engine.drawWidth / 2,
  color: new ex.Color(255, 0, 0),
  collisionType: ex.CollisionType.Fixed,
});

const wallHeight = engine.drawHeight / 2;
const wall1 = new ex.Actor({
  pos: ex.vec(engine.drawWidth / 4, (engine.drawHeight * 3) / 4),
  height: wallHeight,
  width: 20,
  color: new ex.Color(255, 0, 255),
  collisionType: ex.CollisionType.Fixed,
});
const wall2 = new ex.Actor({
  pos: ex.vec((engine.drawWidth * 3) / 4, (engine.drawHeight * 3) / 4),
  height: wallHeight,
  width: 20,
  color: new ex.Color(255, 0, 255),
  collisionType: ex.CollisionType.Fixed,
});

engine.add(sphere);
engine.add(floor);
engine.add(wall1);
engine.add(wall2);
