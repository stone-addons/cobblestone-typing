const system = server.registerSystem(0, 0);
system.registerCommand("test", {
  description: "Test Command",
  permission: 0,
  overloads: [
    {
      parameters: [
        {
          type: "string",
          name: "test"
        }
      ],
      handler(args) {
        return this.name + ": " + args[0];
      }
    } as CommandOverload<["string"]>
  ]
});
function getName(entity: IEntity) {
  return system.getComponent(entity, MinecraftComponent.Nameable).data.name;
}
system.handlePolicy(MinecraftPolicy.PlayerAttackEntity, (data, last) => {
  server.log(getName(data.player) + " attacked " + getName(data.target));
  return last;
});
const db = new SQLite3("test.db");
db.exec("DROP TABLE test");
db.exec("CREATE TABLE test(id)");
db.update("INSERT INTO test VALUES ($test)", { $test: "test" });
server.log(JSON.stringify(db.query("SELECT * from test", {})));
