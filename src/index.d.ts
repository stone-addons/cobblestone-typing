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
  exec(
    sql: string,
    callback?: (line: { [index: string]: string }) => void
  ): number;
  /**
   * perform sql query
   * @param sql SQL expression
   * @param params sql params
   */
  query(
    sql: string,
    params?: SQLite3Param
  ): Array<{ [index: string]: SQLite3Types }>;
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
  block: object;
  float: number;
  bool: boolean;
  text: string;
  json: object;
  entity: IEntity[];
  player: IEntity[];
};
declare type CommandArgument<K> = K extends keyof CommandTypes
  ? {
      name: string;
      type: K;
      optional?: true;
    }
  : never;
declare type MappedArgsDefs<T extends Array<keyof CommandTypes>> = {
  readonly [K in keyof T]: CommandArgument<T[K]>
};
declare type MappedArgs<T extends Array<keyof CommandTypes>> = {
  readonly [K in keyof T]: T[K] extends keyof CommandTypes
    ? CommandTypes[T[K]]
    : never
};

declare interface CommandOrigin {
  name: string;
  world_pos: VectorXYZ;
  entity: IEntity | void;
}

declare type CommandResult =
  | string
  | ({
      [index: string]: string | number | boolean | VectorXYZ;
    } & { toString(): string });

declare interface CommandOverload<
  TArgs extends Array<keyof CommandTypes> = Array<keyof CommandTypes>
> {
  parameters: MappedArgsDefs<TArgs>;
  handler: (this: CommandOrigin, args: MappedArgs<TArgs>) => CommandResult;
}

declare interface CommandDefinition {
  description: string;
  permission: 0 | 1 | 2 | 3 | 4;
  overloads: Array<CommandOverload>;
}

declare type ExtraDataComponent = CompoundTag;

declare const enum MinecraftComponent {
  /**
   * This component represents extra data (NBT) of this entity/block
   */
  ExtraData = "stone:extra_data"
}

declare interface IVanillaServerSystemBase {
  // * POLICY SYSTEM * //
  hasPolicy(name: string): boolean;
  registerPolicy(name: string): void;
  checkPolicy(name: string, data: any, def: boolean): boolean;
  handlePolicy(
    name: string,
    handler: (data: any, last: boolean) => boolean | void
  ): void;
  // * COMMAND SYSTEM * //
  registerCommand(name: string, def: CommandDefinition): void;
  // * EXTRA DATA * //
  getComponent(
    entity: IEntity,
    componentName: MinecraftComponent.ExtraData
  ): IComponent<ExtraDataComponent> | null;
  getComponent(
    block: IBlock,
    componentName: MinecraftComponent.ExtraData
  ): IComponent<ExtraDataComponent> | null;
  // * CHAT * //
  sendText(target: IEntity, content: string): void;
  broadcastText(content: string): void;
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
        entity: IEntity;
        item: IItemStack;
      },
      last: boolean
    ) => boolean | void
  ): void;
  handlePolicy(
    name: MinecraftPolicy.PlayerUseItemOn,
    handler: (
      data: {
        entity: IEntity;
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

declare class BaseTag {
  toString(): string;
}

declare class ByteTag extends BaseTag {
  value: number;
  constructor();
  constructor(value: number);
}
declare class ShortTag extends BaseTag {
  value: number;
  constructor();
  constructor(value: number);
}
declare class IntTag extends BaseTag {
  value: number;
  constructor();
  constructor(value: number);
}
declare class Int64Tag extends BaseTag {
  value: number;
  constructor();
  constructor(value: number);
}
declare class FloatTag extends BaseTag {
  value: number;
  constructor();
  constructor(value: number);
}
declare class DoubleTag extends BaseTag {
  value: number;
  constructor();
  constructor(value: number);
}
declare class ByteArrayTag extends BaseTag {
  value: ArrayBuffer;
  constructor();
  constructor(value: ArrayBuffer);
}
declare class IntArrayTag extends BaseTag {
  value: ArrayBuffer;
  constructor();
  constructor(value: ArrayBuffer);
}
declare class StringTag extends BaseTag {
  value: string;
  constructor();
  constructor(value: string);
}
declare class ListTag extends BaseTag {
  value: BaseTag[];
  constructor();
  constructor(value: BaseTag[]);
}
declare class CompoundTag extends BaseTag {
  value: {
    [index: string]: BaseTag;
  };
  constructor();
  constructor(value: { [index: string]: BaseTag });
}
declare class EndTag extends BaseTag {
  constructor();
}
