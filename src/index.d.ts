/// <reference types="minecraft-scripting-types-server" />

declare type SQLite3Types = string | number | boolean | null;

declare type SQLite3Param = {
  [index: string]: SQLite3Types | undefined;
};

declare class SQLite3 {
  /**
   * Connect to memory-only database
   */
  constructor();
  /**
   * Connect to target database (relative to world folder)
   * @param path Path to database
   */
  constructor(path: string);
  /**
   * perform sql expression
   * @param sql SQL expression
   * @param callback value callback
   */
  exec(sql: string, callback?: (line: { [index: string]: string }) => void): number;
  /**
   * perform sql query
   * @param sql SQL expression
   * @param params sql params
   */
  query(sql: string, params?: SQLite3Param): Array<{ [index: string]: SQLite3Types }>;
  /**
   * perform sql update
   * @param sql SQL expression
   * @param params sql params
   */
  update(sql: string, params?: SQLite3Param): number;
}

declare type CommandTypes = {
  message: string;
  string: string;
  int: number;
  block: string;
  float: number;
  bool: boolean;
  text: string;
  json: object;
  entity: IEntity[];
  player: IEntity[];
  position: VectorXYZ;
};
declare type CommandArgument<K> = K extends keyof CommandTypes
  ? {
      name: string;
      type: K;
      optional?: true;
    }
  : never;
declare type MappedArgsDefs<T extends Array<keyof CommandTypes>> = { readonly [K in keyof T]: CommandArgument<T[K]> };
declare type MappedArgs<T extends Array<keyof CommandTypes>> = {
  readonly [K in keyof T]: T[K] extends keyof CommandTypes ? CommandTypes[T[K]] : never
};

declare interface CommandOrigin {
  name: string;
  world_pos: VectorXYZ;
  entity: IEntity | void;
}

declare type CommandResult =
  | void
  | string
  | ({
      [index: string]: string | number | boolean | VectorXYZ;
    } & { toString(): string });

declare interface CommandOverload<TArgs extends Array<keyof CommandTypes> = Array<keyof CommandTypes>> {
  parameters: MappedArgsDefs<TArgs>;
  handler: (this: CommandOrigin, args: MappedArgs<TArgs>) => CommandResult;
}

declare interface CommandDefinition {
  description: string;
  permission: 0 | 1 | 2 | 3 | 4;
  overloads: Array<CommandOverload>;
}

declare type DimensionComponent = 0 | 1 | 2;
declare type ExtraDataComponent = CompoundTag;
declare type LoreComponent = string[];

declare const enum MinecraftComponent {
  /**
   * This component represents dimension of entity
   */
  Dimension = "stone:dimension",
  /**
   * This component represents extra data (NBT) of this entity/block
   */
  ExtraData = "stone:extra_data",
  /**
   * This component represents lore of item
   */
  Lore = "stone:lore"
}

declare interface ISystemBase {
  // * EXTRA DATA * //
  getComponent(entity: IEntity, componentName: MinecraftComponent.Dimension): IComponent<DimensionComponent> | null;
  applyComponentChanges(entity: IEntity, component: IComponent<DimensionComponent>): void;

  getComponent(entity: IEntity, componentName: MinecraftComponent.ExtraData): IComponent<ExtraDataComponent> | null;
  getComponent(block: IBlock, componentName: MinecraftComponent.ExtraData): IComponent<ExtraDataComponent> | null;

  getComponent(entity: IEntity, componentName: MinecraftComponent.Lore): IComponent<LoreComponent> | null;
  applyComponentChanges(entity: IEntity, component: IComponent<LoreComponent>): void;
  getComponent(entity: IItemStack, componentName: MinecraftComponent.Lore): IComponent<LoreComponent> | null;
  applyComponentChanges(entity: IItemStack, component: IComponent<LoreComponent>): true | null;

  applyComponentChanges(entity: IEntity | IItemStack | IBlock, component: IComponent<any>): true | null;
  getComponent<TCompoent = object>(entity: IEntity | IItemStack | IBlock, componentName: MinecraftComponent | string): IComponent<TCompoent> | null;
  hasComponent(entity: IEntity | IItemStack | IBlock, componentName: MinecraftComponent | string): boolean;
}

declare interface IVanillaServerSystemBase {
  // * POLICY SYSTEM * //
  hasPolicy(name: string): boolean;
  registerPolicy(name: string): void;
  checkPolicy(name: string, data: any, def: boolean): boolean;
  handlePolicy(name: string, handler: (data: any, last: boolean) => boolean | void): void;
  // * COMMAND SYSTEM * //
  registerCommand(name: string, def: CommandDefinition): void;
  // * CHAT * //
  sendText(target: IEntity, content: string, type?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, sender?: string): void;
  broadcastText(content: string): void;
  // * BLOCK * //
  setBlock(ticking: ITickingArea, block: string, pos: VectorXYZ): void;
  setBlock(ticking: ITickingArea, block: string, x: number, y: number, z: number): void;
  getExtraBlock(ticking: ITickingArea, pos: VectorXYZ): IBlock;
  getExtraBlock(ticking: ITickingArea, x: number, y: number, z: number): IBlock;
  setExtraBlock(ticking: ITickingArea, block: string, pos: VectorXYZ): IBlock;
  setExtraBlock(ticking: ITickingArea, block: string, x: number, y: number, z: number): IBlock;
  // * STRUCTURE * //
  getStructure(ticking: ITickingArea, pos: VectorXYZ, size: VectorXYZ): CompoundTag;
  setStructure(ticking: ITickingArea, pos: VectorXYZ, data: CompoundTag): void;
}

declare interface IItemStack {
  /**
   * The type of the object
   */
  readonly __type__: "item_stack";

  /**
   * The identifier of the item stack
   */
  readonly __identifier__: string;

  /**
   * The identifier of the item
   */
  readonly item: string;

  /**
   * The number of items in the stack
   */
  readonly count: number;

  readonly __path__: {
    readonly owner: IEntity;
    readonly type: "hand" | "hotbar" | "supply" | "container";
    readonly index: number;
  };
}

declare const enum MinecraftPolicy {
  PlayerAttackEntity = "stone:player_attack_entity",
  EntityPickItemUp = "stone:entity_pick_item_up",
  EntityDropItem = "stone:entity_drop_item",
  PlayerUseItem = "stone:player_use_item",
  PlayerUseItemOn = "stone:player_use_item_on",
  PlayerDestroyBlock = "stone:player_destroy_block"
}

declare interface IVanillaServerSystemBase {
  hasPolicy(name: MinecraftPolicy.PlayerAttackEntity): true;
  hasPolicy(name: MinecraftPolicy.EntityPickItemUp): true;
  hasPolicy(name: MinecraftPolicy.EntityDropItem): true;
  hasPolicy(name: MinecraftPolicy.PlayerUseItem): true;
  hasPolicy(name: MinecraftPolicy.PlayerUseItemOn): true;
  hasPolicy(name: MinecraftPolicy.PlayerDestroyBlock): true;

  handlePolicy(
    name: MinecraftPolicy.PlayerAttackEntity,
    handler: (
      data: {
        player: IEntity;
        target: IEntity;
      },
      last: boolean
    ) => boolean | void
  ): void;
  handlePolicy(
    name: MinecraftPolicy.EntityPickItemUp,
    handler: (
      data: {
        entity: IEntity;
        item: IItemStack;
      },
      last: boolean
    ) => boolean | void
  ): void;
  handlePolicy(
    name: MinecraftPolicy.EntityDropItem,
    handler: (
      data: {
        entity: IEntity;
        item: IItemStack;
      },
      last: boolean
    ) => boolean | void
  ): void;
  handlePolicy(
    name: MinecraftPolicy.PlayerUseItem,
    handler: (
      data: {
        player: IEntity;
        item: IItemStack;
      },
      last: boolean
    ) => boolean | void
  ): void;
  handlePolicy(
    name: MinecraftPolicy.PlayerUseItemOn,
    handler: (
      data: {
        player: IEntity;
        item: IItemStack;
        pos: VectorXYZ;
        block: IBlock;
      },
      last: boolean
    ) => boolean | void
  ): void;
  handlePolicy(
    name: MinecraftPolicy.PlayerDestroyBlock,
    handler: (
      data: {
        player: IEntity;
        block: IBlock;
      },
      last: boolean
    ) => boolean | void
  ): void;
}

declare interface BaseTag {
  toString(): string;
}
declare type Tag = ByteTag &
  ShortTag &
  IntTag &
  Int64Tag &
  FloatTag &
  DoubleTag &
  ByteArrayTag &
  IntArrayTag &
  StringTag &
  ListTag &
  CompoundTag &
  EndTag;
declare class ByteTag implements BaseTag {
  value: number;
  constructor();
  constructor(value: number);
}
declare class ShortTag implements BaseTag {
  value: number;
  constructor();
  constructor(value: number);
}
declare class IntTag implements BaseTag {
  value: number;
  constructor();
  constructor(value: number);
}
declare class Int64Tag implements BaseTag {
  value: number;
  constructor();
  constructor(value: number);
}
declare class FloatTag implements BaseTag {
  value: number;
  constructor();
  constructor(value: number);
}
declare class DoubleTag implements BaseTag {
  value: number;
  constructor();
  constructor(value: number);
}
declare class ByteArrayTag implements BaseTag {
  value: ArrayBuffer;
  constructor();
  constructor(value: ArrayBuffer);
}
declare class IntArrayTag implements BaseTag {
  value: ArrayBuffer;
  constructor();
  constructor(value: ArrayBuffer);
}
declare class StringTag implements BaseTag {
  value: string;
  constructor();
  constructor(value: string);
}
declare class ListTag implements BaseTag {
  value: Tag[];
  constructor();
  constructor(value: Tag[]);
}
declare class CompoundTag implements BaseTag {
  value: {
    [index: string]: Tag;
  };
  constructor();
  constructor(value: { [index: string]: Tag });
}
declare class EndTag implements BaseTag {
  constructor();
}
