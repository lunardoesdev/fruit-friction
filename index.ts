import * as ex from "excalibur";

const engine = new ex.Engine({
  // backgroundColor: new ex.Color(0, 100, 0),
  physics: {
    gravity: ex.vec(0, 500),
    enabled: true,
    solver: ex.SolverStrategy.Realistic,
  },
});

await engine.start();

let score = 0;
let scoreLabel = new ex.Label({
  text: score.toString(),
  pos: ex.vec(engine.halfDrawWidth, 50),
  font: new ex.Font({
    size: 42,
  }),
});

enum FruitKind {
  Cherry,
  Papaya,
  Mango,
  Peach,
  Melon,
  Watermelon,
  Nothing = 999,
}

class Fruit extends ex.Actor {
  falling: boolean;
  kind: FruitKind;

  override onPostUpdate(engine: ex.Engine, elapsed: number): void {
    if (
      Math.abs(this.pos.x) > 4000 ||
      Math.abs(this.pos.y) > engine.drawHeight
    ) {
      // game over
      engine.remove(this);

      cleanup();
      let label = new ex.Label({
        font: new ex.Font({
          size: 42,
        }),
        pos: ex.vec(engine.halfDrawWidth / 2, engine.halfDrawHeight - 42),
        text:
          "GAME OVER! \nYour score: " +
          score.toString() +
          "\n\n\nClick anywhere to restart",
      });

      engine.add(label);
      engine.input.pointers.primary.once("up", (evt) => {
        reset();
      });
    }
  }

  override onPreCollisionResolve(
    self: ex.Collider,
    other: ex.Collider,
    side: ex.Side,
    contact: ex.CollisionContact,
  ): void {
    const workkind = (self.owner as Fruit).kind;

    if (workkind == FruitKind.Nothing) {
      return;
    }

    if (workkind == FruitKind.Watermelon) {
      // biggest one
      return;
    }

    if ((self.owner as Fruit).kind == (other.owner as Fruit).kind) {
      (self.owner as Fruit).kind = FruitKind.Nothing;
      (other.owner as Fruit).kind = FruitKind.Nothing;

      engine.remove(self.owner as ex.Actor);
      engine.remove(other.owner as ex.Actor);

      const f = new Fruit(workkind + 1);
      f.pos = contact.points[0] || ex.vec(0, 0);
      f.falling = true;
      f.body.collisionType = ex.CollisionType.Active;
      engine.add(f);

      score += (workkind + 5) * 10;
      scoreLabel.text = score.toString();
    }
  }

  constructor(kind: FruitKind) {
    let radius = 0;
    let color = new ex.Color(255, 0, 0);

    switch (kind) {
      case FruitKind.Cherry: {
        radius = 10;
        color = new ex.Color(255, 0, 0);
        break;
      }
      case FruitKind.Papaya: {
        radius = 20;
        color = new ex.Color(255, 255, 0);
        break;
      }
      case FruitKind.Mango: {
        radius = 30;
        color = new ex.Color(255, 0, 255);
        break;
      }
      case FruitKind.Peach: {
        radius = 40;
        color = new ex.Color(100, 100, 0);
        break;
      }
      case FruitKind.Melon: {
        radius = 50;
        color = new ex.Color(100, 0, 100);
        break;
      }
      case FruitKind.Watermelon: {
        radius = 60;
        color = new ex.Color(50, 0, 200);
        break;
      }
    }

    super({
      pos: ex.vec(engine.input.pointers.primary.lastWorldPos.x, 2 * radius),
      collisionType: ex.CollisionType.PreventCollision,
    });
    this.kind = kind;
    this.collider.useCircleCollider(radius);
    this.graphics.use(
      new ex.Circle({
        radius: radius,
      }),
    );

    this.color = color;
    this.falling = false;
  }
}

let sphere: Fruit;
let floor: ex.Actor;
let wall1: ex.Actor;
let wall2: ex.Actor;

engine.input.pointers.primary.on("move", function (evt) {
  if (!sphere.falling) {
    sphere.pos.x = evt.worldPos.x;
  }
});

engine.input.pointers.primary.on("up", function (evt) {
  if (!sphere.falling) {
    sphere.falling = true;
    sphere.body.collisionType = ex.CollisionType.Active;
    sphere = new Fruit(Math.round(Math.random() * FruitKind.Peach));
    engine.add(sphere);
  }
});

function cleanup() {
  engine.currentScene.actors.forEach((a) => {
    engine.remove(a);
  });
}

function reset() {
  cleanup();
  score = 0;
  sphere = new Fruit(FruitKind.Cherry);
  const floorHeight = 10;
  floor = new ex.Actor({
    pos: ex.vec(engine.halfDrawWidth, engine.drawHeight - floorHeight / 2),
    height: floorHeight,
    width: engine.drawWidth / 2,
    color: new ex.Color(255, 0, 0),
    collisionType: ex.CollisionType.Fixed,
  });

  const wallHeight = engine.drawHeight / 2;
  wall1 = new ex.Actor({
    pos: ex.vec(engine.drawWidth / 4, (engine.drawHeight * 3) / 4),
    height: wallHeight,
    width: 20,
    color: new ex.Color(255, 0, 255),
    collisionType: ex.CollisionType.Fixed,
  });
  wall2 = new ex.Actor({
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
  engine.add(scoreLabel);
}

reset();
