
exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('presenca', (table) => {
        table.increments('id')
        table.string('usuario')
        table.string('episodio')
        table.string('repo')
        table.date('date')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('presenca')
};
